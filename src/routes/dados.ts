import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createAt: "asc",
            }
        })
        console.log(memories);
        return memories.map(memory => {
            return {
                id: memory.id,
                cover: memory.cover,
                expecpt: memory.content.substring(0, 155),
            }
        })
    })

    app.get('/memories/:id', async (request) => {
        const paramsScheme = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsScheme.parse(request.params)

        const memory = prisma.memory.findUniqueOrThrow({
            where: {
                id,

            }
        })
        return memory

    })

    app.post('/memories', async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            cover: z.string(),
            isPublic: z.coerce.boolean().default(false),
            userId: z.string().uuid() 
        })

        const { content, cover, isPublic, userId } = bodySchema.parse(request.body)

        const memory = await prisma.memory.create({
            data: {
                content,
                cover,
                isPublic,
                userId
            },
        })
        return memory

    })

    app.put('/memories/:id', async (request) => {

        const paramsScheme = z.object({
            id: z.string().uuid()

        })
        const { id } = paramsScheme.parse(request.params)

        const bodySchema = z.object({
            content: z.string(),
            // cover: z.string(),
            // isPublic: z.coerce.boolean().default(false),
            // userId: z.string().uuid()
        })

        const { content } = bodySchema.parse(request.body)

        const memory = prisma.memory.update({
            where: {
                id,
            },
            data: {
                content,
            }
        })
        return memory
    })

    app.delete('/memories/:id', async (request) => {
        const paramsScheme = z.object({
            id: z.string().uuid()
        })

        const { id } = paramsScheme.parse(request.params)

        await prisma.memory.deleteMany({
            where: {
                id,
            },

        })

    })

}

// export async function memoriesRoutes(app: FastifyInstance) {
//   app.get("/consultaVenda", async () => {
//     const venda = await prisma.venda.findMany({
//       orderBy: {
//         id: "asc",
//       },
//     });
//     // console.log(venda);

//     return venda;
//   });

//   app.get("/consultaProduto/:id", async (request) => {
//     const paramsScheme = z.object({
//       id: z.string().uuid(),
//       // name: z.string().uuid()  //Para pesquisar com o name adicionar ou trocar "/:id" por "/:name"
//     });

//     const { id } = paramsScheme.parse(request.params);
//     // const { name } = paramsScheme.parse(request.params)

//     const produto = prisma.produto.findMany({
//       where: {
//         id,
//         // name
//       },
//       select: {
//         id: true,
//         // name: true
//       },
//     });

//     return produto;
//   });
 
//   app.post("/consultaProduto/:id", async (request) => {
    
//   })

// }
