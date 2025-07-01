import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {globalRouter} from "./routes/global.routes"

dotenv.config();

const app = express();
app.use(cors());
const port = process.env.PORT 

app.use(express.json());
app.use("/api", globalRouter);


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
