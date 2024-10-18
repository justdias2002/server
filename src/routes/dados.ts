import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createAt: "asc",
      },
      include: {
        user: true,
      },
    });

    console.log(memories);

    return memories.map((memory: any) => {
      return {
        id: memory.id,
        name: memory.user.name,
        email: memory.user.email,
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsScheme.parse(request.params);

    const memory = prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
    });

    const { name, email} = bodySchema.parse(request.body);

    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    return user;
  });

  app.put("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsScheme.parse(request.params);

    const bodySchema = z.object({
      name: z.string(),
      email: z.string()
    });

    const { name, email } = bodySchema.parse(request.body);

    const memory = prisma.memory.update({
      where: {
        id,
      },
      data: {
        name,
        email
      },
    });
    return memory;
  });

  app.delete("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsScheme.parse(request.params);

    await prisma.memory.deleteMany({
      where: {
        id,
      },
    });
  });
}
