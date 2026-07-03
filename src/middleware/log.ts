// middlewares/logMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../generated/prisma";


const prisma = new PrismaClient();

export function logMiddleware(tipo: number, mensagem: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const usuarioId = req.user?.id;

      if (usuarioId) {
        await prisma.logatividade.create({
          data: {
            tipo,
            mensagem,
            user_id: usuarioId,
          },
        });
      }

    } catch (error) {
      console.error("Erro ao criar log:", error);
    }

    next();
  };
}


