import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { createLog } from "../../utils/fcuntion.log.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

import {
  logarPsicologo,
  deslogarPsicologo,
} from "../../utils/function.udateStatus_psic.js";
import { ApiError, BadRequest, NotFound } from "../error-handler/api-error.js";
import { createHash } from "crypto";
import { refresh_token } from "../provider/refresh_token_generate.js";
import { userLoginSchema } from "./types/triagem.zod.js";
dotenv.config();

const prisma = new PrismaClient();

export const loginUser = async function (
  req: Request,
  res: Response,
): Promise<any> {
  const { email, password } = req.body;
  const userAgent = req.get("User-Agent") || "unknown-agent";
  const ip = req.ip || "unknown-ip";
  const deviceId = `${userAgent}-${ip}`;

    userLoginSchema.parse(req.body)
  try {
  
    const doesUserExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!doesUserExists) {
      throw new BadRequest("O e-mail ou a senha está incorreto.");
    }

    const senhaDigitadaHash = createHash("sha256")
      .update(password)
      .digest("hex");

    if (doesUserExists.password !== senhaDigitadaHash) {
      throw new BadRequest("O e-mail ou a senha está incorreto.");
    }

    const token = jsonwebtoken.sign(
      { id: doesUserExists.id, role: doesUserExists.role, nome: doesUserExists.nome },
      process.env.SCT as string,
      { expiresIn: "8m" },
    );

    const refreshToken = await refresh_token(doesUserExists.id, ip, deviceId);

    await createLog("Usuário logado", 1, doesUserExists.id);

    const user = {
      id: doesUserExists.id,
      role: doesUserExists.role,
      nome: doesUserExists.nome,
      sobrenome: doesUserExists.sobrenome,
      email: doesUserExists.email,
      photo:doesUserExists.photo,
    };

    return res.status(200).json({ user, token, refreshToken });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message });
    }
    console.error(err);
    res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, role } = req.user;

    const isPsichologist = role === 1 ? { psicologo: true } : undefined;

    const user = await prisma.user.findUnique({
      where: { id:id },
      include: isPsichologist,
    });

    if (!user) {
      throw new NotFound("User não encontrado.");
    }

    // await deslogarPsicologo(user);
    await createLog("Usuário deslogado", 11, user.id);
    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logout:", error);
    return res.status(500).json({ message: "Erro ao realizar logout." });
  }
};
