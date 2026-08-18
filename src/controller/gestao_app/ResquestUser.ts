import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
export async function getPsichologistRequest(
  req: Request,
  res: Response,
): Promise<any> {

  try {
      const psicologos = await prisma.psicologo.findMany({
        where: { status: 2 },
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
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
