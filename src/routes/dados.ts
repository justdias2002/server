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

    return memories.map((memory) => {
      return {
        id: memory.id,
        name: memory.user.name, 
        email: memory.user.email,
        // except: memory.content.substring(0, 255), 
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
      content: z.string(),
      userId: z.string().uuid(),
    });

    const { content, userId } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        userId,
      },
    });
    return memory;
  });

  app.put("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsScheme.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
    });

    const { content } = bodySchema.parse(request.body);

    const memory = prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
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
