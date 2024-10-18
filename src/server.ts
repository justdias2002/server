import fastify from "fastify";
import { memoriesRoutes } from "./routes/dados";
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true  // Se precisar enviar cookies ou autenticação
    // origin: true,

})
app.register(memoriesRoutes)




app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT): 3333,
}).then(() => {
    console.log('🚀HTTP server is running on http://localhost:3333');

});