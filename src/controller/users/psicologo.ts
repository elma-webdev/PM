import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();


export async function createPsicologo(req: Request, res: Response): Promise<any> {
  const { nome, email, password, photo, bio } = req.body;

  try {
    const novoPsicologo = await prisma.psicologo.create({
      data: {
        nome,
        email,
        password,
        photo,
        bio,
        role: "PSICOLOGO",
      },
      select: {
        psycId: true,
        nome: true,
        email: true,
        bio: true,
        role: true,
      },
    });

    return res.status(201).json(novoPsicologo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}


export async function getPsicologos(req: Request, res: Response): Promise<any> {
  try {
    const psicologos = await prisma.psicologo.findMany({
      select: {
        psycId: true,
        nome: true,
        email: true,
        bio: true,
        role: true,
      },
    });

    return res.json(psicologos);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}


export async function getPsicologoById(req: Request, res: Response): Promise<any> {
  const id = parseInt(req.params.id);
  try {
    const psicologo = await prisma.psicologo.findUnique({
      where: { psycId: id },
    });

    if (!psicologo) {
      return res.status(404).json({ message: "Psicólogo não encontrado" });
    }
    const { password, ...rest } = psicologo;
    return res.json(rest);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function updatePsicologo(req: Request, res: Response): Promise<any> {
  const id = parseInt(req.params.id);
  const { nome, photo, bio } = req.body;

  try {
    const psicologo = await prisma.psicologo.update({
      where: { psycId: id },
      data: {
        nome,
        photo,
        bio,
      },
    });

    const { password, ...rest } = psicologo;
    return res.json(rest);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function deletePsicologo(req: Request, res: Response): Promise<any> {
  const id = parseInt(req.params.id);

  try {
    await prisma.psicologo.delete({
      where: { psycId: id },
    });

    return res.json({ message: "Psicólogo deletado com sucesso" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
