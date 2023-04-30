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
  toggleTodo: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    // get todos from prisma
    return ctx.prisma.$transaction(async (tx) => {
      let todo = await tx.todo.findUnique({
        where: {
          id: input,
        },
      });
      if (!todo) {
        return null;
      }
      todo = await tx.todo.update({
        where: {
          id: input,
        },
        data: {
          completed: !todo.completed,
        },
      });
      return todo;
    });
  }),
  createTodo: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => {
    // get todos from prisma
    return ctx.prisma.todo.create({
      data: {
        userId: ctx.session.user.id,
        title: input,
      },
    });
  }),
});
