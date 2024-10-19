import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  
  //Listar
  app.get("/memories", async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  });

  //Buscar 
  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  });

  //Criar 
  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = bodySchema.parse(request.body);

    const user = await prisma.user.create({
      data: { name, email },
    });

    return user;
  });

  //Atualizar 
  app.put("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    });

    const { name, email } = bodySchema.parse(request.body);

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return user;
  });

  //Remover 
  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.user.delete({
      where: { id },
    });

    return { message: "Usuário deletado com sucesso." };
  });
}
