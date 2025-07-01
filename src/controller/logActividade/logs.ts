import { PrismaClient, TipoLog } from "../../generated/prisma";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getLogs = async (req: Request, res: Response): Promise<any> => {
  try {
    const logs = await prisma.logAtividade.findMany({
      orderBy: { data: "desc" },
    });
    return res.status(200).json(logs);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
export const tipoLogs = async (req: Request, res: Response): Promise<any> => {
  const { tipo } = req.query;

  try {
    if (!tipo || typeof tipo !== "string") {
      return res
        .status(400)
        .json({
          error: "Parâmetro 'tipo' é obrigatório e deve ser uma string.",
        });
    }

    if (!Object.values(TipoLog).includes(tipo as TipoLog)) {
      return res.status(400).json({ error: "Tipo de log inválido." });
    }
    const logs = await prisma.logAtividade.findMany({
      where: {
        tipo: tipo as TipoLog,
      },
    });
    return res.status(200).json(logs);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
