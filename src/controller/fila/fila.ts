import { createLog } from "../../../utils/fcuntion.log";
import { PrismaClient } from "../../generated/prisma";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const createFila = async (req: Request, res: Response): Promise<any> => {

    try {
      const { statusFila, urgencia, triagem } = req.body;

       if (!triagem) {
         return res.status(400).json({ message: "Dados inválidos." });
       }

       const ifExistsId = await prisma.triagem.findFirst({
         where: {
           id: Number(triagem),
         },
       });
       if (!ifExistsId) {
         return res.status(400).json({ message: "Esta triagem não existe." });
       }


      const triagemStatus = ifExistsId?.urgencia;
  
      const fila = await prisma.fila.create({
        data: { statusFila, triagem, urgencia:triagemStatus },
        select: {
          entrada: true,
          filaId: true,
          urgencia: true,
          statusFila: true,
          triagem_id: {
            select: {
              user: {
                select: {
                  id: true,
                  paciente: {
                    select: {
                      email: true,
                      photo: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      const id=fila.triagem_id.user.id;
      createLog("Um usuario entrou na fila", "mensagem",id);
      return res.status(201).json(fila);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido." });
    }

    

};
export const getFila = async (req: Request, res: Response): Promise<any> => {

    try {
      const fila = await prisma.fila.findMany();
      return res.json(fila);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido." });
    }
};