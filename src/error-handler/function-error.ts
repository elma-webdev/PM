import { Request, Response, NextFunction } from "express";
import { ApiError } from "./api-error.js";
import { ZodError } from "zod";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
):void {

  if (err instanceof ApiError) {
     res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

   if (err instanceof ZodError) {
     res.status(400).json({
       status: 400,
       message: "Erro de validação",
       errors: err.issues.map((e) => ({
         field: e.path.join("."),
         message: e.message,
       })),
     });
     return;
   }

  console.error(err);

  res.status(500).json({
    status: 500,
    message: "Erro interno no servidor",
  });
}