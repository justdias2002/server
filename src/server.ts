import fastify from "fastify";
import { memoriesRoutes } from "./routes/dados";

const app = fastify()
app.register(memoriesRoutes)




app.listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT): 3333,
}).then(() => {
    console.log('🚀HTTP server is running on http://localhost:3333');

});