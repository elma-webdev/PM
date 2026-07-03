import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import {createLog} from "../../../utils/fcuntion.log.js"
import { BadRequest, Conflict, NotFound } from "../../error-handler/api-error.js";
import client from "../../provider/redisConfig.js";
import { triagemSchema } from "./types/triagem.zod.js";
import { iovariable } from "../../index.js";



export const createTriagem = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.user;
    const { respostas } = req.body;
    
    if (Object.keys(respostas).length === 0){
      throw new BadRequest("Nenhuma resposta foi enviada, responda ao menos uma pergunta do questionário para ser atendido.");

    }
    triagemSchema.parse(respostas)

    const DoesPacientExists = await prisma.paciente.findUnique({
      where: {
        user_id: id,
      },
    });
    if (!DoesPacientExists) throw new NotFound("Este paciente não existe.");

    const DoesTriageExists = await prisma.triagem.findFirst({
      where: { paciente_id: id },
    });

    if (DoesTriageExists)
      throw new Conflict("Já existe uma triagem associada a este paciente!");

    const DoesFilaExists = await prisma.fila.findFirst({
      where: { paciente_id: id },
    });

    if (DoesFilaExists)
      throw new Conflict("O paciente já foi incluído na fila!");

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

    let score = 0;
    for (const id in respostas) {
      if (respostas[id] === "sim") {
        score += pesos[id] || 0;
      }
    }

    let urgencia: 0 | 1 | 2 = 0;
    if (score >= 15) urgencia = 2;
    else if (score >= 6) urgencia = 1;

    const registros = await prisma.$transaction(async (tx) => {
      // 1. Criar triagem
      const triagem = await tx.triagem.create({
        data: {
          paciente_id: id,
          respostas: JSON.stringify(respostas),
          score,
          urgencia,
        },
      });

      const fila = await tx.fila.create({
        data: {
          paciente_id: id,
          urgencia,
          triagem_id: triagem.id,
          statusFila: 2,
        },
      });

      createLog("Foi feita uma triagem.", 2, id);
      createLog("Um usuário foi adicionado à lista.", 6, id);

      return { triagem, fila };
    });

    await client.zAdd(
      "fila_espera",
      [{ score: Date.now(), value: id.toString() }],
      { NX: true },
    );

    // --- Broadcast ---
    iovariable.emit("fila_atualizada", {
      user_id:id,
      message:"Novo user na lista de espera",
      // usuarioId: result.triagem.id,
      // posicao: posicaoAtualUser !== null ? posicaoAtualUser + 1 : 1,
      // totalNaFila,
    });
    return res.status(201).json({
      message: "Dados registrados com sucesso.",
      registros,
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
