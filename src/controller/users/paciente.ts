import { Request, Response } from "express";
import { createLog } from "../../../utils/fcuntion.log.js";
import { createHash } from "node:crypto";
import { uploadToSupabase } from "../../provider/supabase.file.js";
import { ApiError, Conflict } from "../../error-handler/api-error.js";
import { patientSchema } from "./types/types.users.js";
import { prisma } from "../../../lib/prisma.js";
import { z } from "zod";

export async function createPaciente(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    // Se vier via FormData, req.body.user é string
    if (req.body.user && typeof req.body.user === "string") {
      req.body.user = JSON.parse(req.body.user);
    }
    const parsed = patientSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(parsed.error.message);
      return res.status(400).json({ message: parsed.error.message });
    }
    const { idade, telefone, user, nbi } = parsed.data;
    const { nome, email, password, sobrenome } = user;
    const doesUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (doesUserExist) {
      return res
        .status(409)
        .json({ message: "Usuário ja cadastrado no sistema." });
    }

    const file: any = req.file;
    let image = null;
    if (file) {
      image = await uploadToSupabase(file);
    }

    const hashPassword = createHash("sha256").update(password).digest("hex");

    const paciente = await prisma.paciente.create({
      data: {
        idade,
        nbi,
        telefone,
        user: {
          create: {
            email,
            nome,
            password: hashPassword,
            photo: image,
            sobrenome,
            role: 0,
          },
        },
      },
      select: {
        user_id: true,
        user: {
          select: {
            id: true,
            email: true,
            photo: true,
            role: true,
            nome: true,
            sobrenome: true,
            createdAt: true,
          },
        },
      },
    });

    await createLog("Novo paciente cadastrado no sistema", 8, paciente.user_id);
    return res.status(201).json(paciente);
  } catch(error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          mensagem: "Dados inválidos.",
          erros: error.message
        });
      }
      if (error instanceof ApiError) {
      return res.status(500).json({ message: error.message });
    }
      console.error("Erro ao criar agendamento:", error);
      return res.status(500).json({
        mensagem: "Erro interno ao criar agendamento.",
      });
    }
}

export async function getPacientes(req: Request, res: Response): Promise<any> {
  try {
    const pacientes = await prisma.paciente.findMany({
      select: {
        idade: true,
        telefone: true,
        createdAt: true,
        user: {
          select: {
            sobrenome: true,
            nome: true,
            email: true,
            photo: true,
            id: true,
          },
        },
      },
    });
    return res.json(pacientes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function getPacientesById(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const { id } = req.params;
    const pacientes = await prisma.paciente.findUnique({
      where: {
        user_id: String(id),
      },
      select: {
        triagem: true,
        idade: true,
        telefone: true,
        createdAt: true,
        user: {
          select: {
            photo: true,
            id: true,
          },
        },
      },
    });
    return res.json(pacientes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
