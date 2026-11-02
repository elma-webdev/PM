// src/app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { globalRouter } from "./routes/global.routes.ts";
import { errorHandler } from "./error-handler/function-error.ts";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", globalRouter);
app.use(errorHandler);

export default app;