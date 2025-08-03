import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json"; // caminho correto

import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalRouter } from "./routes/global.routes";
import  cron  from "node-cron";
dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT;

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", globalRouter);

import("../swagger").then(() => {
  console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});

// cron.schedule('* * * * * ', () => {
//   console.log("oiii");
// });

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
