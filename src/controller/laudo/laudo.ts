import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { laudoSchema } from "./types/laudo.zod.js";

export async function CreateReport(req: Request, res: Response): Promise<any> {
  try {
    const parsed = laudoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const {
      conclusao,
      discussao,
      historico,
      objetivo,
      resultado,
      paciente_id,
      psicologo_id,
      assinatura,
    } = parsed.data;

    const laudo = await prisma.laudo.create({
      data: {
        conclusao,
        discussao,
        historico,
        objetivo,
        resultado,
        paciente_id,
        psicologo_id,
        assinatura,
      },
    });

    return res.status(201).json(laudo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function UpdateReport(req: Request, res: Response): Promise<any> {
  try {
    const parsed = laudoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const {
      conclusao,
      discussao,
      historico,
      objetivo,
      resultado,
      paciente_id,
      psicologo_id,
      assinatura,
    } = parsed.data;
    const { id } = req.params;

    const laudo = await prisma.laudo.update({
      where: { laudo_id: id },
      data: {
        conclusao,
        discussao,
        historico,
        objetivo,
        resultado,
        paciente_id,
        psicologo_id,
        assinatura,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(laudo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
