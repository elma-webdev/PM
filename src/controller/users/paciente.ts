import { Request, Response } from "express";
import { createLog } from "../../../utils/fcuntion.log.js";
import { createHash } from "node:crypto";
import { uploadToSupabase } from "../../provider/supabase.file.js";
import { Conflict } from "../../error-handler/api-error.js";
import { patientSchema } from "./types/types.users.js";
import { prisma } from '../../../lib/prisma.js';

export async function createPaciente(
  req: Request,
  res: Response,
): Promise<any> {
  const {idade, telefone, nome, email, password, sobrenome,photo} = req.body;

  patientSchema.parse(req.body);

  try {
  const doesUserExist = await prisma.user.findFirst({
    where: {
      email:email
    }
  });

  if (doesUserExist) {
    throw new Conflict("Email já cadastrado no sistema.");
  }

  const hashPassword = createHash("sha256").update(password).digest("hex");

  const file:any = req.file;
  let image = null;
  if (file) {
    image= await uploadToSupabase(file);
  }

  
    const paciente = await prisma.paciente.create({
      data: {
        idade,
        telefone,
        user: {
          create: {
            email,
            nome,
            password: hashPassword,
            photo:image,
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
    res.status(201).json(paciente);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
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
    res.json(pacientes);
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
        user_id: id,
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
    res.json(pacientes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

