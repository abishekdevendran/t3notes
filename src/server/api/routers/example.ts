import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return "Hello from trpc";
  }),
  getSecretAll: protectedProcedure.input(z.string()).query(({ input }) => {
    return input === "secret" ? "Hello" : "Not allowed";
  }),
  getAllTodos: protectedProcedure.query(({ ctx }) => {
    // get todos from prisma
    return ctx.prisma.todo.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),
  toggleTodo: protectedProcedure
    .input(z.object({ id: z.string(), state: z.boolean() }))
    .mutation(({ input, ctx }) => {
      // get todos from prisma
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          completed: !input.state,
        },
      });
    }),
  createTodo: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      // get todos from prisma
      return ctx.prisma.todo.create({
        data: {
          userId: ctx.session.user.id,
          title: input,
        },
      });
    }),
  deleteTodo: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input,
        },
      });
    }),
});
