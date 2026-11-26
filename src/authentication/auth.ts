import { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { createLog } from "../../utils/fcuntion.log.js";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { ApiError, BadRequest, NotFound, Unauthorized } from "../error-handler/api-error.js";
import { createHash } from "crypto";
import { refresh_token } from "../provider/refresh_token_generate.js";
import { userLoginSchema } from "./types/triagem.zod.js";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import z from "zod";
dotenv.config();

export const loginUser = async function (
  req: Request,
  res: Response,
): Promise<any> {

  try{
    const userAgent = req.get("User-Agent") || "unknown-agent";
  const ip = req.ip || "unknown-ip";
  const deviceId = `${userAgent}-${ip}`;

   const credenciais=userLoginSchema.safeParse(req.body);

   if(!credenciais.success){
    return res.status(400).json({
        mensagem: credenciais.error.message,
      });
   }

   const {email, password}=credenciais.data

    const doesUserExists = await prisma.user.findUnique({
      where: { email },
      include: { psicologo: true },
    });

    if (!doesUserExists) {
      throw new BadRequest("O e-mail ou a senha está incorreto.");
    }

    // 🚫 Bloqueio direto no login
    if (doesUserExists.role === 1) {
      const status = doesUserExists.psicologo?.status;
      if (status === 2) {
        return res.status(403).json({
          message:
            "Seu perfil ainda está em processo de avaliação. Aguarde a verificação para acessar o sistema.",
        });
      }
    }

    const senhaValida = await bcrypt.compare(password, doesUserExists.password);

    if (!senhaValida) {
   throw new BadRequest("Email ou senha inválidos.");
  }

    const token = jsonwebtoken.sign(
      {
        id: doesUserExists.id,
        role: doesUserExists.role,
        nome: doesUserExists.nome,
      },
      process.env.SCT as string,
      { expiresIn: "15m"},
    );

    const expiresInSeconds = dayjs().add(7, "day").unix();
    const durationMs = (expiresInSeconds - dayjs().unix()) * 1000;

    const refreshToken = await refresh_token(doesUserExists.id, ip, deviceId);

    await createLog("Usuário logado", 1, doesUserExists.id);

    const user = {
      id: doesUserExists.id,
      role: doesUserExists.role,
      nome: doesUserExists.nome,
      sobrenome: doesUserExists.sobrenome,
      email: doesUserExists.email,
      photo: doesUserExists.photo,
    };
    // Guardar refresh token em cookie httpOnly
    res.cookie("refreshToken", refreshToken.refresh, {
      httpOnly: true,
      secure: false, // só via HTTPS
      sameSite: "strict", // evita CSRF
      maxAge: durationMs
    });
    return res.status(200).json({ user, token });
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
  };


export const logoutUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id, role } = req.user;

    // const isPsichologist = role === 1 ? { psicologo: true } : undefined;

    const user = await prisma.user.findUnique({
      where: { id: id },
      // include: isPsichologist,
    });

    if (!user) {
      throw new NotFound("User não encontrado.");
    }

    // await deslogarPsicologo(user);
    await createLog("Usuário deslogado", 11, id);
    return res.status(200).json({ message: "Logout realizado com sucesso." });
  } catch (error) {
    console.error("Erro no logout:", error);
    return res.status(500).json({ message: "Erro ao realizar logout." });
  }
};
