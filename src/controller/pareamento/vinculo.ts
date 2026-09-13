import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";

export const getVinculo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { psicologo_id} = req.params;
    const vinculo = await prisma.PacientePsicologo.findMany({
      where: { psicologo_id },
      include: {
        paciente: {
          select: {
            user: {
              select: {
                nome: true,
                email: true,
                sobrenome: true,
              },
            },
          },
        },
      },
    });
    if (!vinculo){
      return res.status(404).json({message:"Não possui ainda nenhum vínculo"})
    }
    return res.status(200).json(vinculo);
  } catch (err: unknown) {
    console.log(err)
    return res.status(500).json({ error: err });
  }
};