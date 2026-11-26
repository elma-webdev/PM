import { z } from "zod";
import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";
import { EstadoAgendamento } from "../../../generated/prisma/enums.ts";
import { ApiError, BadRequest, Conflict, NotFound, Unauthorized } from "../../error-handler/api-error.ts";
import { idParamSchema, observacaoSchema } from "./types/agenda.schema.ts";
import { temConflitoHorario } from "../../../helpers/date.function.ts";


export const aprovarSolicitacaoAgendamento = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    
    const validacao_agendamento = idParamSchema.safeParse(req.params.agendamento_id);
  
    const observacao = observacaoSchema.safeParse(req.body ?? {});
    
      if (!observacao.success) {
      return res.status(400).json({
        message: "Parâmetro inválido.",
        erros: z.flattenError(observacao.error).fieldErrors,
      });
    }


    if (!validacao_agendamento.success) {
      return res.status(400).json({
        message: "Parâmetro inválido.",
        erros: z.flattenError(validacao_agendamento.error).fieldErrors,
      });
    }

    const id = validacao_agendamento.data;

    const agendamento = await prisma.agendamento.findUnique({
      where: { agendamento_id:id },
      include: {
        paciente:true,
        psicologo: true
      },
    });

    if (!agendamento) {
      return res.status(404).json({
        message: "Agendamento não encontrado.",
      });
    }

    if (agendamento.estado !== EstadoAgendamento.SOLICITADO) {
      throw new BadRequest(
        `Não é possível alterar o estado. O agendamento encontra-se atualmente como '${agendamento.estado}'.`,
    );
    }

    let psicologoParaAtribuir: string | undefined;

    // 1. Sem psicologo_id nem pref_genero: secretaria pode passar psicologo_id via req.body
    if (!agendamento.psicologo_id && !agendamento.pref_genero) {

       if(req.body?.psicologo_id){
        throw new BadRequest(
          "Este agendamento não possui psicólogo. Informe um psicologo válido para aprovar."
        );
       } 

      const psicologo_id = idParamSchema.safeParse(req.body.psicologo_id)

        if(!psicologo_id.success){
            return res.status(400).json(psicologo_id.error.message)
        }

      const psicologo = await prisma.psicologo.findUnique({
        where: { user_id: id },
      });

      if (!psicologo) {
        throw new NotFound("Psicólogo não encontrado.");
      }

      if (!agendamento.dataInicio || !agendamento.dataFim) {
        throw new BadRequest("O agendamento não possui data de início ou data de fim definida.");
      }

      const ocupado = await temConflitoHorario(
        psicologo.user_id,
        agendamento.dataInicio,
        agendamento.dataFim
      );

      if (ocupado) {
        throw new Conflict(
          "O psicólogo selecionado já tem uma consulta nesse intervalo. Escolha outro psicólogo."
        );
      }

       const agendamentoAtualizado = await prisma.agendamento.update({
      where: { agendamento_id:id },
      data: {
        estado: EstadoAgendamento.PENDENTE_PAGAMENTO,
        psicologo_id: psicologo.user_id,
        observacao:observacao.data.observacao
      },
      include: {
        paciente: {
          include: {
            user: {
              select: { id: true, nome: true, sobrenome: true, email: true },
            },
          },
        },
        psicologo: {
          include: {
            user: {
              select: { id: true, nome: true, sobrenome: true, email: true },
            },
          },
        },
        pagamentos: true,
        sessao: true,
      },
    });

    return res.status(200).json({
        message: "Agendamento aprovado e aguardando pagamento.",
        agendamento: agendamentoAtualizado,
      });

    }

// Caso 2: Já existe psicologo_id atribuído
    if (agendamento.psicologo_id) {
        
      const observacao = observacaoSchema.safeParse(req.body ?? {});

      if (!observacao.success) {
        return res.status(400).json({
          message: "Parâmetro inválido.",
          erros: z.flattenError(observacao.error).fieldErrors,
        });
      }

      const querTrocarPsicologo =
        req.body?.id !== undefined && req.body?.id !== null && req.body?.id !== "";

      if (querTrocarPsicologo) {
        const id_psicologo_sugerido = idParamSchema.safeParse( req.body.id);

        if (!id_psicologo_sugerido.success) {
          return res.status(400).json({
            message: "Parâmetro inválido.",
            erros: z.flattenError(id_psicologo_sugerido.error).fieldErrors,
          });
        }

        // Só valida disponibilidade e atualiza psicologo_id se for um psicólogo diferente do atual
        if (id_psicologo_sugerido.data !== agendamento.psicologo_id) {
          if (!agendamento.dataInicio || !agendamento.dataFim) {
            throw new BadRequest("O agendamento não possui data de início ou data de fim definida.");
          }

          const novoPsicologo = await prisma.psicologo.findUnique({
            where: { user_id: id_psicologo_sugerido.data },
          });

          if (!novoPsicologo) {
            throw new NotFound("Novo psicólogo não encontrado.");
          }

          const ocupado = await temConflitoHorario(
            novoPsicologo.user_id,
            agendamento.dataInicio,
            agendamento.dataFim
          );

          if (ocupado) {
            throw new Conflict(
              "O novo psicólogo selecionado já tem uma consulta nesse intervalo. Escolha outro psicólogo."
            );
          }

          const agendamentoAtualizado = await prisma.agendamento.update({
            where: { agendamento_id: id },
            data: {
              estado: EstadoAgendamento.PENDENTE_PAGAMENTO,
              psicologo_id: novoPsicologo.user_id,
              observacao: observacao.data.observacao,
            },
            include: {
              paciente: {
                include: {
                  user: {
                    select: { id: true, nome: true, sobrenome: true, email: true },
                  },
                },
              },
              psicologo: {
                include: {
                  user: {
                    select: { id: true, nome: true, sobrenome: true, email: true },
                  },
                },
              },
              pagamentos: true,
              sessao: true,
            },
          });

          return res.status(200).json({
            message: "Agendamento aprovado com alteração de psicólogo e aguardando pagamento.",
            agendamento: agendamentoAtualizado,
          });
        }
      }
      // Se não houve troca (ou enviou o mesmo ID), cai no Caso 3 abaixo e aprova mantendo o psicólogo atual
    }
    // Caso 3: Já tem psicologo_id e não houve troca -> mantém o update original sem alterar psicologo_id

    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { agendamento_id:id },
      data: {
        estado: EstadoAgendamento.PENDENTE_PAGAMENTO,
        observacao:observacao.data.observacao
      },
      include: {
        paciente: {
          include: {
            user: {
              select: { id: true, nome: true, sobrenome: true, email: true },
            },
          },
        },
        psicologo: {
          include: {
            user: {
              select: { id: true, nome: true, sobrenome: true, email: true },
            },
          },
        },
        pagamentos: true,
        sessao: true,
      },
    });

    return res.status(200).json({
      message: "Agendamento aprovado e aguardando pagamento.",
      agendamento: agendamentoAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar estado do agendamento:", error);
    return res.status(500).json({
      message: "Erro interno ao processar a atualização do agendamento.",
    });
  }
};