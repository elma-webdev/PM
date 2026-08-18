import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { NotFound, Conflict } from "../../error-handler/api-error.js";
export const createAgenda = async function (
  req: Request,
  res: Response,
): Promise<any> {
  const { id } = req.user;
  const { slots, modalidade, disponibilidade } = req.body;
  // slots = array de objetos { dataHora, ocupado, modalidade }
  try {
    const doesPsicologoExists = await prisma.psicologo.findUnique({
      where: { user_id: id },
    });

    if (!doesPsicologoExists) {
      throw new NotFound("Este usuário não existe");
    }

    const agenda = await prisma.agenda_psicologo.create({
      data: {
        modalidade,
        disponibilidade,
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
    const agenda = await prisma.agenda_psicologo.findMany();
    return res.json(agenda);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export async function ocuparSlot(psicologo_id: string, dataHora: string) {

  const agenda = await prisma.agenda_psicologo.findUnique({
    where: { psicologo_id },
  });

  if (!agenda || !agenda.disponibilidade) {
    throw new Error("Agenda não encontrada.");
  }

  const slots = (agenda.disponibilidade as any[]).map((slot) =>
    slot.dataHora === dataHora ? { ...slot, ocupado: true } : slot
  );

  // Atualiza a agenda
  const updatedAgenda = await prisma.agenda_psicologo.update({
    where: { psicologo_id },
    data: { disponibilidade: slots },
  });
  console.log(slots)
  return updatedAgenda;
}

