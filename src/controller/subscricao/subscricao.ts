import { prisma } from "../../../lib/prisma.js";
import {
  BadRequest,
  UnprocessableEntity,
} from "../../error-handler/api-error.js";
import { subscricaoSchema } from "./types/subscricao.zod.js";
import { Request, Response } from "express";
export const CreateSubscricao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const parsed = subscricaoSchema.parse(req.body);
    if (!parsed) {
      throw new BadRequest("Dados inválidos");
    }
    const { plano_id, psicologo_id, fim, referencia } = parsed;
    const subscricao = await prisma.subscricao.create({
      data: {
        fim,
        referencia,
        plano_id,
        psicologo_id,
        status: 0,
      },
    });

    return res.status(201).json(subscricao);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
export const Subscricao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const subscricao = await prisma.subscricao.findMany();

    return res.status(201).json(subscricao);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
export const EnableSubscricao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { subsc_id } = req.params;

    const { referencia } = subscricaoSchema.parse(req.body);
    if (!referencia) {
      throw new UnprocessableEntity("Subscricao nao pode ser ativada");
    }

    const subscricao = await prisma.subscricao.update({
      where: { subsc_id },
      data: {
        status: 1,
        inicio: new Date(),
      },
    });

    return res.status(200).json({ message: "Subscricao activada", subscricao });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
export const DisableSubscricao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { subsc_id } = req.params;

    const subscricao = await prisma.subscricao.findUnique({
      where: { subsc_id },
      select: { plano: true },
    });
    if (!subscricao) {
      return res.status(404).json({ message: "Subscrição não encontrada." });
    }

    const subscriptionDate = new Date(subscricao.inicio);
    const fim = new Date(subscriptionDate);
    fim.setMonth(fim.getMonth() + subscricao.plano.duracao);
    const currentDate = new Date();

    if (currentDate >= fim) {
      const disablingSubscricao = await prisma.subscricao.update({
        where: { subsc_id },
        data: {
          status: 0,
          fim: new Date(),
        },
      });
      return res
        .status(401)
        .json({ message: "seu periódo de subscrição terminou." });
    }
    return res.status(200).json({ message: "Subscricao activa" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const CancelSubscricao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { subsc_id } = req.params;


    const subscricao = await prisma.subscricao.update({
      where: { subsc_id },
      data: {
        status: 0,
        fim: new Date(),
      },
    });

    return res.status(200).json({ message: "Subscricao desativada", subscricao });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};