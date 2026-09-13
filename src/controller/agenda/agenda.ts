import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { NotFound, Conflict } from "../../error-handler/api-error.js";
export const createAgenda = async function (
  req: Request,
  res: Response,
): Promise<any> {
  const { id } = req.user;
  const {dataHora, disponibilidade}=req.body

  try {
    const doesPsicologoExists = await prisma.psicologo.findUnique({
      where: { user_id: id },
    });

    if (!doesPsicologoExists) {
      throw new NotFound("Este usuário não existe");
    }

    const agenda = await prisma.agenda_psicologo.create({
      data: {
        dataHora, disponibilidade,
        psicologo_id: id,
      },
    });
    return res.status(200).json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const getAgenda = async function (
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const { psicologo_id } = req.params;
    const agenda = await prisma.agenda_psicologo.findMany({where: { psicologo_id }});
    return res.json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const updateSlot = async function (
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const { id } = req.user;
    const { agenda_id } = req.params;
    const { disponibilidade, dataHora} = req.body;

    const doesPsicologoExists = await prisma.psicologo.findUnique({
      where: { user_id: id },
      include: {
        agenda_psicologo: true,
      },
    });

    if (!doesPsicologoExists) {
      throw new NotFound("Este usuário não existe");
    }

    if (!doesPsicologoExists.agenda_psicologo.agenda_id) {
      throw new NotFound("Agenda não encontrada.");
    }
   
  const agenda = await prisma.agenda_psicologo.update({
    where: { agenda_id },
    data: { disponibilidade, dataHora },
  });
    
    return res.status(200).json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
// export async function ocuparSlot(psicologo_id: string, dataHora: string) {
//   const 
//   const agenda = await prisma.agenda_psicologo.findUnique({
//     where: { psicologo_id },
//   });

//   if (!agenda || !agenda.disponibilidade) {
//     throw new Error("Agenda não encontrada.");
//   }

//   // Atualiza a agenda
//   const agenda = await prisma.agenda_psicologo.update({
//     where: { psicologo_id },
//     data: { disponibilidade: false },
//   });
//   console.log(agenda);
//   return agenda;
// }
