import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { createLog } from "../../../utils/fcuntion.log.js";
import {
  ApiError,
  BadRequest,
  Conflict,
  NotFound,
} from "../../error-handler/api-error.js";
import bcrypt from "bcrypt";
import { uploadToSupabase } from "../../provider/supabase.file.js";
import { psychologistSchema } from "./types/types.users.js";
import z from "zod";

export async function createPsicologo(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    // Se vier via FormData, req.body.user é string
    if (req.body.user && typeof req.body.user === "string") {
      req.body.user = JSON.parse(req.body.user);
    }
    const parsed = psychologistSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log(`${parsed.error.message}`);
      return res.status(400).json({
    message: "Erro de validação nos dados enviados.",
    erros: z.flattenError(parsed.error).fieldErrors,
  });
    }
    const {
      numero_ordem,
      especialidade,
      bio,
      user,
      ano_experiencia,
      contacto,
      idiomas,
      nacionalidade,
      nbi,
      sexo,
    } = parsed.data;

    const { nome, email, password, sobrenome } = user;

    const doesEmailExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (doesEmailExist) {
      throw new Conflict( "Este email já pertence a um usuário.")
    }

    const file: any = req.file;
    let image = null;
    if (file) {
      image = await uploadToSupabase(file);
    }
   const saltRounds = 10;
const hashPassword = await bcrypt.hash(password, saltRounds);
    const psichologist = await prisma.psicologo.create({
      data: {
        bio,
        especialidade,
        numero_ordem,
        ano_experiencia,
        contacto,
        idiomas,
        nacionalidade,
        nbi,
        sexo,
        user: {
          create: {
            email,
            password: hashPassword,
            photo: image,
            role: 1,
            nome,
            sobrenome,
          },
        },
      },
    });

    await createLog(
      "Novo psicologo cadastrado no sistema",
      8,
      psichologist.user_id,
    );
    console.log(image, file);
    return res.status(201).json({
      message:
        "Seu perfil entrará em processo de avaliação, dentre em breve receberá um e-mail. Aguarde a verificação para acessar o sistema.",
    });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } 
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function getPsicologos(req: Request, res: Response): Promise<any> {
  try {
    const psicologos = await prisma.psicologo.findMany({
      where: { status: 1 },
      select: {
        user_id: true,
        bio: true,
        sexo: true,
        contacto: true,
        idiomas: true,
        numero_ordem: true,
        nbi: true,
        especialidade: true,
        ano_experiencia: true,
        user: {
          select: {
            photo: true,
            createdAt: true,
            nome:true,
            sobrenome:true,
            email:true
          },
        },
        avaliacao: true,
      },
    });

    return res.json(psicologos);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.name });
    }
    console.error("ERRO NO GET PSICOLOGOS:");
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function getPsicologoById(
  req: Request,
  res: Response,
): Promise<any> {
  const id = req.params.id;
  try {
    const psicologo = await prisma.psicologo.findUnique({
      where: { user_id: String(id) },
     select: {
        user_id: true,
        bio: true,
        sexo: true,
        contacto: true,
        idiomas: true,
        numero_ordem: true,
        nbi: true,
        especialidade: true,
        ano_experiencia: true,
        user: {
          select: {
            photo: true,
            createdAt: true,
            nome:true,
            sobrenome:true,
            email:true
          },
        },
        avaliacao: true,
        posts:true
      },
    });

    if (!psicologo) {
      throw new NotFound("Psicólogo não encontrado");
    }
    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function updatePsicologo(
  req: Request,
  res: Response,
): Promise<any> {
  const id = req.params.id;
  const { nome, bio, especialidade } = req.body;
  const file = req.file;
  let image = null;
  if (file) {
    image = await uploadToSupabase(file);
  }

  try {
    const psicologo = await prisma.psicologo.update({
      where: { user_id: String(id) },
      data: {
        nome,
        photo: image,
        bio,
        especialidade,
      },
    });

    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function deletePsicologo(
  req: Request,
  res: Response,
): Promise<any> {
  const id = req.params.id;

  try {
    await prisma.psicologo.delete({
      where: { user_id: String(id) },
    });

    return res.json({ message: "Psicólogo deletado com sucesso" });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function getUsers(req: Request, res: Response): Promise<any> {
  try {
    const users = await prisma.user.findMany({});
    return res.json(users);
  } catch(error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({
            mensagem: "Dados inválidos.",
            erros: error.name
          });
        }
        if (error instanceof ApiError) {
        return res.status(error.status).json({ message: error.name });
      }
        console.error("Erro ao criar agendamento:", error);
        return res.status(500).json({
          mensagem: "Erro interno ao criar agendamento.",
        });
      }
}
