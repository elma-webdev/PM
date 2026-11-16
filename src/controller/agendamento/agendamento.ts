import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";
import { EstadoAgendamento } from "../../../generated/prisma/enums.ts";
import { BadRequest, NotFound, Unauthorized } from "../../error-handler/api-error.ts";
import { criarAgendamentoSchema } from "./types/agenda.schema.ts";

import { z } from "zod";
import { calcularDataFim, validarHorarioAtendimento } from "../../../helpers/date.function.ts";

export const criarAgendamento = async (req: Request, res: Response): Promise<any> => {
  try {
   
    const paciente_id = req.user?.id;
    if (!paciente_id) {
      throw new Unauthorized("Utilizador não autenticado.");
    }

   
    const dados = criarAgendamentoSchema.parse(req.body);

    // 3. Impede agendamento no passado
    if (dados.dataInicio <= new Date()) {
      throw new BadRequest(
        "A data de início deve ser no futuro.",
      );
    }

   
    const dataFim = calcularDataFim(dados.dataInicio, dados.duracaoMinutos);

    const horarioValido = validarHorarioAtendimento(dados.dataInicio, dataFim);
    if (!horarioValido.valido) {
      return res.status(400).json({
        mensagem: horarioValido.mensagem,
      });
    }
  
    const paciente = await prisma.paciente.findUnique({
      where: { user_id: paciente_id },
    });

    if (!paciente) {
      throw new NotFound
      ("Paciente não encontrado.");
    }

    if (dados.psicologo_id) {

      const psicologo = await prisma.psicologo.findUnique({
        where: { user_id: dados.psicologo_id },
      });

      if (!psicologo) {
         throw new NotFound
      ("Psicólogo não encontrado." );
        
      }

      const conflito = await prisma.agendamento.findFirst({
        where: {
          psicologo_id: dados.psicologo_id,
          AND: [
            { dataInicio: { lt: dataFim } },
            { dataFim: { gt: dados.dataInicio } },
          ],
          OR: [
            { estado: EstadoAgendamento.CONFIRMADO },
            {
              estado: EstadoAgendamento.PENDENTE_PAGAMENTO,
              expiracaoReserva: { gt: new Date() },
            },
          ],
        },
      });

      if (conflito) {
        return res.status(409).json({
          mensagem: "O psicólogo já tem uma consulta nesse intervalo.",
        });
      }
    }

    const agendamento = await prisma.agendamento.create({
      data: {
        modo_sessao: dados.modo_sessao,
        psicologo_id: dados.psicologo_id || null,
        paciente_id,
        dataInicio: dados.dataInicio,
        dataFim,
        duracaoMinutos: dados.duracaoMinutos,
        observacao: dados.observacao,
        valor: dados.valor,
        estado: EstadoAgendamento.SOLICITADO,
      },
      include:{
        psicologo:{
          include:{
            user:{
              select: {
              id: true,
              nome: true,
              sobrenome: true,
              photo: true,
              email: true,
                      }
            }
          }
        }
      }
    });

    return res.status(201).json({
      mensagem: "Agendamento solicitado com sucesso.",
      agendamento,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        mensagem: "Dados inválidos.",
        erros: error.message
      });
    }
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({
      mensagem: "Erro interno ao criar agendamento.",
    });
  }
};