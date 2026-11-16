import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";

import client from "../../provider/redisConfig.ts";
import { generateZoomMeeting } from "../../provider/zoom-service.ts";
import { Conflict, NotFound } from "../../error-handler/api-error.ts";
import { iovariable, userSockets } from "../../server.ts";
import { EstadoSessao } from "../../../generated/prisma/enums.ts";
import { Prisma } from "../../../generated/prisma/client.ts";

export const criarSessao = async (req: Request, res:Response):Promise <any>=> {
  try {
    const { agendamento_id, status, inicio, fim, extra_data } = req.body;

    // Validação básica
    if (!agendamento_id) {
      return res.status(400).json({ error: 'O campo agendamento_id é obrigatório.' });
    }

    // Verifica se o agendamento existe
    const agendamentoExiste = await prisma.agendamento.findUnique({
      where: { agendamento_id }
    });

    if (!agendamentoExiste) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    // Como agendamento_id é @unique, verifica se já existe sessão para ele
    const sessaoExistente = await prisma.sessao.findUnique({
      where: { agendamento_id }
    });

    if (sessaoExistente) {
      return res.status(400).json({ error: 'Já existe uma sessão para este agendamento.' });
    }

    // Cria a sessão
    const novaSessao = await prisma.sessao.create({
      data: {
        agendamento_id,
        status: status || 'AGENDADA',
        inicio: inicio ? new Date(inicio) : null,
        fim: fim ? new Date(fim) : null,
        extra_data: extra_data || null
      },
      include: {
        agendamento: true // Retorna os dados do agendamento junto
      }
    });

    return res.status(201).json(novaSessao);
  } catch (error) {
    console.error('Erro ao criar sessão:', error);
    return res.status(500).json({ error: 'Erro interno ao criar sessão.' });
  }
};

/**
 * Visualiza sessões filtradas por data (dia específico ou intervalo)
 * Query params aceitos: 
 * - data (ex: ?data=2026-06-06) -> Retorna o dia inteiro
 * - inicio & fim (ex: ?inicio=2026-06-01&fim=2026-06-30) -> Retorna um intervalo
 */
export const visualizarSessoesPorData = async (req: Request, res:Response):Promise <any> => {
  try {
    const { data, inicio, fim, status } = req.query;
    let whereClause : Prisma.SessaoWhereInput = {};

    // Filtro por status opcional
    if (status) {
      whereClause.status = status as EstadoSessao;
    }

    // Caso 1: Filtrar por um dia específico (ex: ?data=2026-06-06)
    if (data) {
      const dataInicio = new Date(`${data}T00:00:00.000Z`);
      const dataFim = new Date(`${data}T23:59:59.999Z`);

      whereClause.inicio = {
        gte: dataInicio,
        lte: dataFim
      };
    } 
    // Caso 2: Filtrar por intervalo de datas (ex: ?inicio=2026-06-01&fim=2026-06-30)
    else if (inicio && fim) {
      whereClause.inicio = {
        gte: new Date(`${inicio}T00:00:00.000Z`),
        lte: new Date(`${fim}T23:59:59.999Z`)
      };
    }

    const sessoes = await prisma.sessao.findMany({
      where: whereClause,
      include: {
        agendamento: true // Traz os detalhes do agendamento relacionado
      },
      orderBy: {
        inicio: 'asc'
      }
    });

    return res.status(200).json({
      total: sessoes.length,
      sessoes
    });
  } catch (error) {
    console.error('Erro ao buscar sessões por data:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar sessões.' });
  }
};


