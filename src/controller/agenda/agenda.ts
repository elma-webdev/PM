import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma";
export const createAgenda = async function (
  req: Request,
  res: Response
): Promise<any> {
  const { id } = req.user;
  const { limiteAtendimento } = req.body;

  try {

   const agenda= await prisma.agenda_psicologo.create({
      data:{limiteAtendimento, psicologoAgenda:id, isLogged:1, status_disponibilidade:1}, 
    });
    return res.status(200).json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err)
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const getAgenda=async function(req:Request, res:Response):Promise<any>{
  try {
    const agenda=await prisma.agenda_psicologo.findMany();
    return res.json(agenda)
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}