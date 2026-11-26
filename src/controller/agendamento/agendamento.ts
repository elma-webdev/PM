import { z } from "zod";
import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";
import { EstadoAgendamento } from "../../../generated/prisma/enums.ts";
import { ApiError, BadRequest, Conflict, NotFound, Unauthorized } from "../../error-handler/api-error.ts";
import { criarAgendamentoSchema, idParamSchema } from "./types/agenda.schema.ts";
import { calcularDataFim, temConflitoHorario, validarHorarioAtendimento } from "../../../helpers/date.function.ts";

export const criarAgendamento = async (req: Request, res: Response): Promise<any> => {
  try {
   
    const paciente_id =  idParamSchema.safeParse(req.user.id);
    if (!paciente_id) {
      throw new Unauthorized("Utilizador não autenticado.");
    }
    //console.log("Tipo de req.body:", typeof req.body, paciente_id);

    if (!paciente_id.success){
       return res.status(400).json(paciente_id.error.message)
    }

    const dadosValidos = criarAgendamentoSchema.safeParse(req.body);

    if(!dadosValidos.success){
    return res.status(400).json({
      message:"Erro de validacao",
      errors:z.flattenError(dadosValidos.error).fieldErrors
    })
    }
    const {dataInicio,duracaoMinutos,modo_sessao,pref_genero, psicologo_id}=dadosValidos.data

    const dataFim = calcularDataFim(dataInicio, duracaoMinutos);

    const horarioValido = validarHorarioAtendimento(dataInicio, dataFim);
    if (!horarioValido.valido) {
      return res.status(400).json({
        mensagem: horarioValido.mensagem,
      });
    }

    const paciente = await prisma.paciente.findUnique({
      where: { user_id: paciente_id.data },
    });

    if (!paciente) {
      throw new NotFound
      ("Paciente não encontrado.");
    }

    // 1. Se passar pref_genero e psicologo_id em simultâneo -> Conflito
    
   const temPrefGenero = pref_genero !== undefined && pref_genero !== null;
   const temPsicologo = Boolean(psicologo_id);
    if (temPrefGenero && temPsicologo) {
      throw new Conflict(
        "O agendamento não pode ter psicólogo específico e preferência de género definidos simultaneamente: escolha um deles ou pule esta etapa"
      );
    }

    let psicologoAlocadoId: string | null = null;

   // 2. Se escolher apenas pref_genero -> procurar psicólogo do sexo indicado sem conflito
    if (pref_genero) {
      const candidatos = await prisma.psicologo.findMany({
        where: {
          sexo: pref_genero,
        },
      });

      for (const candidato of candidatos) {
        const ocupado = await temConflitoHorario(candidato.user_id, dataInicio, dataFim);
        // se candidato nao tem conflito neste horario
        if (!ocupado) {
          psicologoAlocadoId = candidato.user_id;
          break;
        }
      }

      if (!psicologoAlocadoId) {
        return res.status(409).json({
          mensagem:
            "Não há psicólogo disponível com a preferência de género selecionada para este horário. Tente outro horário ou escolha outro psicólogo.",
        });
      }
    }

    // 3. Se escolher psicologo_id -> verificar conflito e pedir para escolher outro se houver
    if (psicologo_id) {
      const psicologo = await prisma.psicologo.findUnique({
        where: { user_id: psicologo_id },
      });

      if (!psicologo) {
        throw new NotFound("Psicólogo não encontrado.");
      }

      const ocupado = await temConflitoHorario(psicologo_id, dataInicio, dataFim);
      if (ocupado) {
        return res.status(409).json({
          mensagem:
            "O psicólogo selecionado já tem uma consulta nesse intervalo. Por favor, escolha outro psicólogo.",
        });
      }

      psicologoAlocadoId = psicologo_id;
    }

    // 4. Se não escolher nem psicologo_id nem pref_genero -> cria com os dados fornecidos
    const agendamento = await prisma.agendamento.create({
      data: {
        modo_sessao: modo_sessao || 0,
        psicologo_id: psicologoAlocadoId,
        pref_genero: pref_genero || null,
        paciente_id: paciente_id.data,
        dataInicio: dataInicio,
        dataFim,
        duracaoMinutos: duracaoMinutos,
        estado: EstadoAgendamento.SOLICITADO,
      },
      include: {
        psicologo: {
          include: {
            user:{
              select:{
                email:true,
                nome:true,
                password:true
              }
            }
          },
        },
      },
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
    if(error instanceof ApiError){
      return res.status(error.status).json(error.message)
    }
    console.error("Erro ao criar agendamento:", error);
    return res.status(500).json({
      mensagem: "Erro interno ao criar agendamento.",
    });
  }
};