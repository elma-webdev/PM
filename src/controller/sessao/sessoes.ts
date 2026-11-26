import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";

import client from "../../provider/redisConfig.ts";
import { generateZoomMeeting } from "../../provider/zoom-service.ts";
import { ApiError, Conflict, NotFound } from "../../error-handler/api-error.ts";
import { iovariable, userSockets } from "../../server.ts";
import { EstadoSessao } from "../../../generated/prisma/enums.ts";
import { Prisma } from "../../../generated/prisma/client.ts";
import { sessao_schema } from "./types/sessao.schema.ts";
import z from "zod";

export const criarSessao = async (req: Request, res:Response):Promise <any>=> {
  try {
    const sessao = sessao_schema.safeParse(req.body);

    if (!sessao.success){
      return res.status(400).json({
        mensagem: sessao.error?.message
      });
    }

    const {agendamento_id, status}= sessao.data

    const agendamentoExiste = await prisma.agendamento.findFirst({
      where: { agendamento_id, estado:"PENDENTE_PAGAMENTO"}
    });

    if (!agendamentoExiste) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }
    
    const sessaoExistente = await prisma.sessao.findUnique({
      where: { agendamento_id }
    });

    if (sessaoExistente) {
      return res.status(400).json({ error: 'Já existe uma sessão para este agendamento.' });
    }

    let extra_data: Prisma.InputJsonValue | undefined = undefined;

    if (agendamentoExiste.modo_sessao === 0) {
    const gerarLinkZoom = await generateZoomMeeting(
    agendamentoExiste.dataInicio,
    undefined,
    agendamentoExiste.duracaoMinutos);

  extra_data = {
    id: gerarLinkZoom.id,
    join_url: gerarLinkZoom.join_url,
    password: gerarLinkZoom.password ?? null,
    start_url: gerarLinkZoom.start_url,
    created_at: gerarLinkZoom.created_at,
    agenda: gerarLinkZoom.agenda,
    host_id: gerarLinkZoom.host_id,
    host_email: gerarLinkZoom.host_email,
    type: gerarLinkZoom.type,
    status: gerarLinkZoom.status,
    topic: agendamentoExiste.observacao ?? gerarLinkZoom.topic,
    duration: gerarLinkZoom.duration,
  };
    }
    
    const novaSessao = await prisma.sessao.create({
      data: {
       agendamento_id,
       status: status || 'AGENDADA',
       inicio: agendamentoExiste.dataInicio,
       fim:  agendamentoExiste.dataFim,
       extra_data
    }});

    return res.status(201).json(novaSessao);
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
        agendamento: true 
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


