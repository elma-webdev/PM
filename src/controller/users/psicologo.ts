import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { createLog } from "../../../utils/fcuntion.log.js";
import {
  ApiError,
  BadRequest,
  Conflict,
} from "../../error-handler/api-error.js";
import { createHash } from "node:crypto";
import { uploadToSupabase } from "../../provider/supabase.file.js";
import { psychologistSchema } from "./types/types.users.js";

export async function createPsicologo(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const parsed = psychologistSchema.safeParse(req.body);
    if (!parsed.success) {
      throw parsed.error;
    }
    const { numero_ordem, especialidade, bio, user, ano_conclusao, ano_experiencia, contacto, grau_academico, idiomas, nacionalidade, nbi, sexo, universidade } = parsed.data;
    const { nome, email, password, sobrenome } = user;

    const file: any = req.file;
    let image = null;
    if (file) {
      image = await uploadToSupabase(file);
    }
    const hashPassword = createHash("sha256").update(password).digest("hex");
    const psichologist = await prisma.psicologo.create({
      data: {
        bio,
        especialidade,
        numero_ordem,
        ano_conclusao,
        ano_experiencia,
        contacto,
        grau_academico,
        idiomas,
        nacionalidade,
        nbi,
        sexo,
        universidade,
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
    return res
      .status(201)
      .json({
        message:
          "Seu perfil entrará em processo de avaliação, dentre em breve receberá um e-mail. Aguarde a verificação para acessar o sistema.",
      });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else if (err instanceof prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          message: "Duplicidade detectada: já existe registro com esse valor.",
        });
      }
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
        createdAt: true,
        numero_ordem: true,
        especialidade: true,
        bio: true,
        avaliacao: true,
        user: {
          select: {
            email: true,
            nome: true,
            photo: true,
            sobrenome: true,
          },
        },
      },
    });

    return res.json(psicologos);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
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
      where: { user_id: id },
      select: {
        user_id: true,
        bio: true,
        agenda: true,
        user: {
          select: {
            photo: true,
            createdAt: true,
          },
        },
        posts: true,
      },
    });

    if (!psicologo) {
      return res.status(404).json({ message: "Psicólogo não encontrado" });
    }
    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof Error) {
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
      where: { user_id: id },
      data: {
        nome,
        photo: image,
        bio,
        especialidade,
      },
    });

    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
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
      where: { user_id: id },
    });

    return res.json({ message: "Psicólogo deletado com sucesso" });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function getUsers(req: Request, res: Response): Promise<any> {
  try {
    const users = await prisma.user.findMany({});
    return res.json(users);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
