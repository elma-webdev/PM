import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger-output.json.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalRouter } from "./routes/global.routes.js";
import { errorHandler } from "./error-handler/function-error.js";

dotenv.config();
const app = express();
const server = createServer(app);
app.use(cors());
const port = process.env.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", globalRouter);

export const iovariable = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST", "UPDATE", "DELETE", "PATCH"],
  },
});

// Escutar conexões globais
iovariable.on("connection", (socket) => {
  console.log(`⚡ Usuário conectado: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log("❌ Usuário desconectou");
  });
});

// import("../swagger").then(() => {
//   console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
// });


app.use(errorHandler);

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
