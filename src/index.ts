import swaggerUi from "swagger-ui-express";
// import swaggerDocument from "../swagger-output.json.js";
import { createServer } from "node:http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalRouter } from "./routes/global.routes.js";
import { errorHandler } from "./error-handler/function-error.js";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
const server = createServer(app);
app.use(cors());
const port = process.env.PORT;
const authConfig =(process.env.SCT as string) 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", globalRouter);

export const iovariable = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "UPDATE", "DELETE", "PATCH"],
  },
});

// salvar dados de autenticacao
iovariable.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));

  jwt.verify(token, authConfig, (error:any, decoded:any) => {
    if (error) return next(new Error("Invalid token"));

    const payload = decoded as { id: string; role: number };
    socket.data.user = payload; 
    next();
  });
});
export const userSockets: Record<string, string> = {};
// Escutar conexões globais
iovariable.on("connection", (socket) => {
  const { id, role } = socket.data.user;
  userSockets[id] = socket.id;
  if (role === 2) { 
    socket.join("admins");
  } 
  else if(role === 1) 
  {
    socket.join("psicologos");
  }else{
    socket.join("pacientes");
  }
  console.log(`Usuário ${id} conectado com socket ${socket.id} na role ${role}`);
  // socket.on("disconnect", () => {
  //   delete userSockets[id];
  // });
});


// import("../swagger").then(() => {
//   console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
// });


app.use(errorHandler);

server.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
