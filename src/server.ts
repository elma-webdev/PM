// src/server.ts
import { createServer } from "node:http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import client from "./provider/redisConfig.ts";
import app from "./app.ts"; // Importa o app limpo do index.ts

dotenv.config();
const server = createServer(app);
const port = process.env.PORT || 3000;
const authConfig = process.env.SCT as string;

export const iovariable = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

iovariable.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token"));

  jwt.verify(token, authConfig, (error: any, decoded: any) => {
    if (error) return next(new Error("Invalid token"));
    const payload = decoded as { id: string; role: number };
    socket.data.user = payload;
    next();
  });
});

export const userSockets: Record<string, string> = {};

iovariable.on("connection", async (socket) => {
  const { id, role } = socket.data.user;
  userSockets[id] = socket.id;

  if (role === 2) {
    socket.join("admins");
  } else if (role === 1) {
    socket.join("psicologos");
    await client.set(`psicologo:${id}`, JSON.stringify({ isLogged: 1 }));
  } else {
    socket.join("pacientes");
  }

  socket.on("disconnect", async () => {
    await client.set(`psicologo:${id}`, JSON.stringify({ isLogged: 0 }));
    delete userSockets[id];
  });
});

//if (process.env.NODE_ENV !== "test") {
 // server.listen(port, () => {
 //   console.log(`Servidor rodando em http://localhost:${port}`);
  //});}
