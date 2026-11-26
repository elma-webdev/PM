import jsonwebtoken from "jsonwebtoken";
import dayjs from "dayjs";
import { ApiError, BadRequest } from "../error-handler/api-error.js";
import { prisma } from "../../lib/prisma.js";
import { Request, Response } from "express";
import z from "zod";

export const RefreshToken = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const refresh = req.cookies.refreshToken; // vem do cookie httpOnly

    if (!refresh) {
      return res.status(400).json({ error: "Refresh token não encontrado" });
    }

    const is_refresh_token = await prisma.refreshToken.findUnique({
      where: { refresh },
      include: { user: true },
    });

    if (!is_refresh_token) {
      return res.status(400).json({ error: "Refresh token inválido" });
    }

    if (dayjs().unix() > is_refresh_token.expiresIn) {
      await prisma.refreshToken.delete({
        where: { token_id: is_refresh_token.token_id },
      });
      return res
        .status(400)
        .json({ error: "Refresh token expirado. Faça login novamente." });
    }

    const token = jsonwebtoken.sign(
      {
        id: is_refresh_token.user.id,
        role: is_refresh_token.user.role,
        nome: is_refresh_token.user.nome,
      },
      process.env.SCT as string,
      { expiresIn: "15m" },
    );

    // Rotação opcional
    const expiresInSeconds = dayjs().add(7, "day").unix();
    await prisma.refreshToken.delete({
      where: { token_id: is_refresh_token.token_id },
    });
    const newRefreshToken = await prisma.refreshToken.create({
      data: {
        refresh: crypto.randomUUID(),
        expiresIn: dayjs().add(7, "day").unix(),
        ip: req.ip || "unknown-ip",
        user_agent: req.get("User-Agent") || "unknown-agent",
        user_id: is_refresh_token.user.id,
      },
    });

    const durationMs = (expiresInSeconds - dayjs().unix()) * 1000;
    res.cookie("refreshToken", newRefreshToken.refresh, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: durationMs
    });

    return res.status(200).json({ token });
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
