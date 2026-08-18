import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { planoSchema } from "./types/plano.zod.js";

export async function createPlano(req:Request, res:Response): Promise<any> {
  try {
    const parsed = planoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { duracao, nivel, valor } = parsed.data;
    const plano = await prisma.plano.create({
      data: { duracao, nivel, valor },
    });

    return res.status(201).json(plano);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function updatePlano(req:Request, res:Response): Promise<any> {
  try {
    const parsed = planoSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { duracao, nivel, valor } = parsed.data;
    const { id } = req.params;

    const plano = await prisma.plano.update({
      where: { plano_id: id },
      data: { duracao, nivel, valor },
    });

    return res.status(200).json(plano);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function deletePlano(req:Request, res:Response): Promise<any> {
  try {
    
    const { id } = req.params;

    const plano = await prisma.plano.delete({
      where: { plano_id: id },
    });

    return res.status(200).json(plano);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function getPlanos(req:Request, res:Response): Promise<any> {
  try {

    const plano = await prisma.plano.findMany();

    return res.status(200).json(plano);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function getPlanoById(req:Request, res:Response): Promise<any> {
  try {
    
    const { id } = req.params;

    const plano = await prisma.plano.findUnique({
      where: { plano_id: id },
    });

    return res.status(200).json(plano);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
