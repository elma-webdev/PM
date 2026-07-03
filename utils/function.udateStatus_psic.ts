import { prisma } from "../lib/prisma";
import { NextFunction, Request, Response } from "express";


export const logarPsicologo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role, id } = req.user;
  if (role === 1) {
    try {
      await prisma.agenda_psicologo.update({
        where: { psicologoAgenda: id },
        data: { isLogged: 1 },
      });
    } catch (error) {
      console.warn(
        "Aviso: Falha ao atualizar o status de isLogged. Login continua.",
        error
      );
    }
  }
  next();
  return
};

export const deslogarPsicologo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role, id } = req.user;
  if (role === 1) {
    try {
      const psicologo = await prisma.psicologo.findUnique({
        where: { userId: id },
      });

      if (psicologo) {
        await prisma.agenda_psicologo.update({
          where: { psicologoAgenda: psicologo.psycId },
          data: { isLogged: 0 },
        });
        console.log("Psicólogo deslogado");
      }
    } catch (error) {
      console.warn(
        "Aviso: Falha ao atualizar isLogged. Logout continua.",
        error,
      );
    }
  }

  next()
  return;
};
