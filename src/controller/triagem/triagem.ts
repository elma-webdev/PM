import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import {createLog} from "../../../utils/fcuntion.log"

const prisma = new PrismaClient();

export const createTriagem = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { userId, respostas } = req.body;

    if (!userId || typeof respostas !== "object") {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    const ifExistsId=await prisma.user.findFirst({
      where: {
        id:userId
      }
    })
     if (!ifExistsId) {
       return res.status(400).json({ message: "Este user não existe." });
     }

    const pesos: Record<string, number> = {
      tristeza: 2,
      ansiedade: 2,
      irritabilidade: 1,
      sono: 1,
      apetite: 1,
      isolamento: 1,
      criseAtual: 5,
      automutilacao: 8,
      pensamentosSuicidas: 10,
    };

    // Calcular score
    let score = 0;
    for (const id in respostas) {
      if (respostas[id] === "sim") {
        score += pesos[id] || 0;
      }
    }

    // Classificação com base no score
    let urgencia: "leve" | "média" | "alta" = "leve";
    if (score >= 15) urgencia = "alta";
    else if (score >= 6) urgencia = "média";

    // Salvar no banco de dados
    const triagemCriada = await prisma.triagem.create({
      data: {
        userId,
        respostas: JSON.stringify(respostas),
        score,
        urgencia,
      },
    });
    
    createLog("Foi feita uma triagem.", "inicio_triagem", userId );

    return res.status(201).json({
      message: "Triagem registrada com sucesso.",
      triagem: triagemCriada,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

export const getTriagem = async (req: Request, res: Response): Promise<any> => {
  try {

    const triagem=await prisma.triagem.findMany({
      orderBy:{
        createdAt:"asc"
      }
    })
    return res.json(triagem)

  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};
