import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma=new PrismaClient()

export const createAgenda = async function (
  req: Request,
  res: Response
): Promise<any> {
  const { atendimento,limiteAtendimento, psicologoId } = req.body;

  try {
  
   const agenda= await prisma.agenda_psicologo.create({
      data:{atendimento,limiteAtendimento, psicologoId, isLogged:true, status_disponibilidade:true, }, 
    });
    return res.status(200).json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
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