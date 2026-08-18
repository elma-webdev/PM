import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { relatorioSchema } from "./types/relatorio.zod.js";

export async function CreateReport(req: Request, res: Response): Promise<any> {
  try {
    const parsed = relatorioSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const {
      analises,
      conclusao,
      demanda,
      procedimentos,
      paciente_id,
      psicologo_id,
      local_atendimento,
      assinatura,
    } = parsed.data;

    const relatorio = await prisma.relatorio.create({
      data: {
        analises,
        conclusao,
        demanda,
        procedimentos,
        paciente_id,
        psicologo_id,
        local_atendimento,
        assinatura,
      },
    });

    return res.status(201).json(relatorio);
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
    const parsed = relatorioSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const {
      analises,
      conclusao,
      demanda,
      procedimentos,
      paciente_id,
      psicologo_id,
      local_atendimento,
      assinatura,
    } = parsed.data;
    const {id} = req.params

    const relatorio = await prisma.relatorio.update({
      where: { relatorio_id: id },
      data: {
        analises,
        conclusao,
        demanda,
        procedimentos,
        paciente_id,
        psicologo_id,
        local_atendimento,
        assinatura,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(relatorio);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
