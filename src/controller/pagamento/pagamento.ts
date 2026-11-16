import { Request, Response } from 'express';
import { prisma } from "../../../lib/prisma.ts";
import { EstadoPagamento } from '../../../generated/prisma/enums.ts';
import { Prisma } from '../../../generated/prisma/client.ts';

export const criarPagamento = async (req: Request, res: Response):Promise <any> => {
  try {
    const {
      agendamento_id,
      valor,
      estado,
      metodoPagamento,
      referencia,
      dataPagamento,
    } = req.body;

    // 1. Validações básicas
    if (!agendamento_id || valor === undefined) {
      return res.status(400).json({
        error: 'Os campos agendamento_id e valor são obrigatórios.',
      });
    }

    // 2. Verifica se o agendamento existe
    const agendamentoExiste = await prisma.agendamento.findUnique({
      where: { agendamento_id },
    });

    if (!agendamentoExiste) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' });
    }

    // 3. Se informou referência, verifica se já existe (pois é @unique)
    if (referencia) {
      const referenciaExiste = await prisma.pagamento.findUnique({
        where: { referencia },
      });

      if (referenciaExiste) {
        return res.status(400).json({
          error: 'Já existe um pagamento registado com esta referência.',
        });
      }
    }

    // 4. Cria o pagamento
    const novoPagamento = await prisma.pagamento.create({
      data: {
        agendamento_id,
        valor, // O Prisma aceita number ou string e converte para Decimal(10, 2)
        estado: (estado as EstadoPagamento) || 'PENDENTE',
        metodoPagamento: metodoPagamento || null,
        referencia: referencia || null,
        dataPagamento: dataPagamento ? new Date(dataPagamento) : null,
      },
      include: {
        agendamento: true,
      },
    });

    return res.status(201).json(novoPagamento);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno ao registar pagamento.' });
  }
};

/**
 * Lista pagamentos com filtros opcionais:
 * - ?estado=PAGO (ou PENDENTE, CANCELADO, etc.)
 * - ?agendamento_id=uuid
 * - ?data=2026-11-15 (filtra pela dataPagamento num dia específico)
 * - ?inicio=2026-11-01&fim=2026-11-30 (filtra por intervalo de datas)
 */
export const listarPagamentos = async (req: Request, res: Response) => {
  try {
    const { estado, agendamento_id, data, inicio, fim } = req.query;

    const whereClause: Prisma.PagamentoWhereInput = {};

    if (estado) {
      whereClause.estado = estado as EstadoPagamento;
    }

    if (agendamento_id) {
      whereClause.agendamento_id = String(agendamento_id);
    }

    // Filtro por dia específico
    if (data) {
      whereClause.dataPagamento = {
        gte: new Date(`${data}T00:00:00.000Z`),
        lte: new Date(`${data}T23:59:59.999Z`),
      };
    } 
    // Filtro por intervalo de datas
    else if (inicio && fim) {
      whereClause.dataPagamento = {
        gte: new Date(`${inicio}T00:00:00.000Z`),
        lte: new Date(`${fim}T23:59:59.999Z`),
      };
    }

    const pagamentos = await prisma.pagamento.findMany({
      where: whereClause,
      include: {
        agendamento: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      total: pagamentos.length,
      pagamentos,
    });
  } catch (error) {
    console.error('Erro ao listar pagamentos:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar pagamentos.' });
  }
};

/**
 * Atualiza o estado ou dados de um pagamento (ex: confirmar pagamento)
 */
export const atualizarPagamento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado, metodoPagamento, referencia, dataPagamento, valor } = req.body;

    const pagamentoExiste = await prisma.pagamento.findUnique({
      where: { pagamento_id: id },
    });

    if (!pagamentoExiste) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    const pagamentoAtualizado = await prisma.pagamento.update({
      where: { pagamento_id: id },
      data: {
        ...(estado && { estado: estado as EstadoPagamento }),
        ...(metodoPagamento !== undefined && { metodoPagamento }),
        ...(referencia !== undefined && { referencia }),
        ...(valor !== undefined && { valor }),
        // Se mudou o estado para PAGO e não enviou data, preenche com a data atual
        ...(dataPagamento
          ? { dataPagamento: new Date(dataPagamento) }
          : estado === 'PAGO' && !pagamentoExiste.dataPagamento
          ? { dataPagamento: new Date() }
          : {}),
      },
    });

    return res.status(200).json(pagamentoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar pagamento.' });
  }
};

/**
 * Busca um único pagamento pelo ID
 */
export const buscarPagamentoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const pagamento = await prisma.pagamento.findUnique({
      where: { pagamento_id: id },
      include: {
        agendamento: true,
      },
    });

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' });
    }

    return res.status(200).json(pagamento);
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar pagamento.' });
  }
};