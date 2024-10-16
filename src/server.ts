import fastify from "fastify";
import { memoriesRoutes } from "./routes/dados";

const app = fastify()
app.register(memoriesRoutes)



// app.post('/create', async () => {
//     return 'World Hello'
// const users = await prisma.user.create
// })

app.listen({
    port: 3333,
}).then(() => {
    console.log('🚀HTTP server is running on http://localhost:3333');

});