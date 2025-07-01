// src/controller/avaliacao.controller.ts
import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();


export async function createAvaliacao(req: Request, res: Response): Promise<any> {
  try {
    const { sms, userId, psicologoId } = req.body;
    const avaliacao = await prisma.avaliacao.create({
      data: { sms, userId, psicologoId },
    });
    return res.status(201).json(avaliacao);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

// Get all Avaliacoes
export async function getAvaliacoes(_req: Request, res: Response): Promise<any> {
  try {
    const lista = await prisma.avaliacao.findMany({
      include: {
        User: {
          select: {
            pacientes: {
              select: {
                email: true,
                nome: true,
              },
            },
          },
        },
        psicologo: {
          select: {
            email: true,
            nome: true,
          },
        },
      },
    });
    return res.status(200).json(lista);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

// Get one Avaliacao by id
export async function getAvaliacaoById(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { idStars: Number(id) },
      include: {
        User: {
          select: {
            pacientes: {
              select: {
                email: true,
                nome: true,
              },
            },
          },
        },
        psicologo: {
          select: {
            email: true,
            nome: true,
          },
        },
      },
    });
    if (!avaliacao) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }
    return res.status(200).json(avaliacao);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

// Update an Avaliacao
export async function updateAvaliacao(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    const { sms } = req.body;
    const updated = await prisma.avaliacao.update({
      where: { idStars: Number(id) },
      data: { sms },
    });
    return res.status(200).json(updated);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

// Delete an Avaliacao
export async function deleteAvaliacao(req: Request, res: Response): Promise<any> {
  try {
    const { id } = req.params;
    await prisma.avaliacao.delete({ where: { idStars: Number(id) } });
    return res.status(204).send();
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

