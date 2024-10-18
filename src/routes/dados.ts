import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const user = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
     
    });

    console.log(user);

    return user.map((user: any) => {
      return {
        id: user.id,
        name: user.user.name,
        email: user.user.email,
      };
    });
  });

  app.get("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsScheme.parse(request.params);

    const user = prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return user;
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

    const user = prisma.user.update({
      where: {
        id,
      },
      data: {
        name,
        email
      },
    });
    return user;
  });

  app.delete("/memories/:id", async (request) => {
    const paramsScheme = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsScheme.parse(request.params);

    await prisma.user.deleteMany({
      where: {
        id,
      },
    });
  });
}
