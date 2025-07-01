import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export async function createPaciente(req: Request, res: Response): Promise<any> {
  const { nome, email, telefone, idade, password, photo } = req.body;

  try {
    const paciente = await prisma.paciente.create({
      data: {
        nome,
        email,
        telefone,
        password,
        idade,
        photo,
        User: {
          create: {
            role: "PACIENTE",
            isAnonimo: false,
          },
        },
      },
      select: {
        nome: true,
        email: true,
        telefone: true,
      },
    });
    res.status(201).json(paciente);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function getPacientes(req: Request, res: Response):Promise<any> {
  try {
    const pacientes = await prisma.paciente.findMany({
      select: {
        nome: true,
        email: true,
        telefone: true,
        userId: true
      }
    });
    res.json(pacientes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function createAnonimo(req: Request, res: Response): Promise<any> {
  try {
    const anonimo = await prisma.user.create({
      data: {
        role: "PACIENTE",
        isAnonimo: true,
      },
      select: {
        role: true,
        isAnonimo: true,
      },
    });
    res.json(anonimo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
