import {Request, Response} from "express";
import { PrismaClient } from "../generated/prisma";
import { createLog } from "../../utils/fcuntion.log";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const loginPaciente = async function(req:Request, res:Response):Promise<any>{
    const {email, password}=req.body

    try {
      const ifEmailExists = await prisma.paciente.findUnique({
        where: { email }
      });
      if (!ifEmailExists) {
        return res.status(404).json({ message: "this user does not exist" });
      }

      if (ifEmailExists.password !== password) {
        return res.status(404).json({ message: "this user does not exist" });
      }

      const createToken = jsonwebtoken.sign(
        ifEmailExists,
        process.env.SCT as string,
        {expiresIn: "30min"}
      );
      await createLog("Usuário logado", "login", ifEmailExists.pacId);
      return res.status(200).json({ token: createToken, user: ifEmailExists });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido." });
    }

}
export const loginPsicologo = async function(req:Request, res:Response):Promise<any>{
    const {email, password}=req.body

    try {
      const ifEmailExists = await prisma.psicologo.findUnique({
        where: { email }
      });
      if (!ifEmailExists) {
        return res.status(404).json({ message: "this user does not exist" });
      }

      if (ifEmailExists.password !== password) {
        return res.status(404).json({ message: "this user does not exist" });
      }

      const createToken = jsonwebtoken.sign(
        ifEmailExists,
        process.env.SCT as string,
        {expiresIn: "30min"}
      );
      await createLog("Usuário logado", "login", ifEmailExists.psycId);

      const agenda=await prisma.agenda_psicologo.findUnique({
        where: { psicologoId: ifEmailExists.psycId },
      });

       if (!agenda) {
         return res.status(404).json({ message: "Agenda não encontrada." });
       }

       await prisma.agenda_psicologo.update({
         where: { psicologoId: ifEmailExists.psycId},
         data: { isLogged: false },
       });

      return res.status(200).json({ token: createToken, user:ifEmailExists });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido." });
    }

}


export const logoutPsicologo = async (req: Request, res: Response) => {
  try {
    const { psycId } = req.params;

    const agenda = await prisma.agenda_psicologo.findUnique({
      where: { psicologoId: Number(psycId)},
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda não encontrada." });
    }

   
    await prisma.agenda_psicologo.update({
      where: { psicologoId: Number(psycId) },
      data: { isLogged: false },
    });
    await createLog("Usuário deslogado", "logout", agenda.psicologoId);
    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } 
  catch (error) {
    console.error("Erro no logout:", error);
    return res.status(500).json({ message: "Erro ao realizar logout." });
  }
};
