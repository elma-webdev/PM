import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../server.ts";
import dotenv from "dotenv";
import { EstadoAgendamento } from "../../../generated/prisma/enums.ts";

dotenv.config();

export const filtrarAgendamentoPorEstado = async (req: Request, res:Response):Promise <any> => {
  try {
    const { estado } = req.query;

    if (!estado) {
      return res.status(400).json({
        mensagem: "Informe o estado do agendamento."
      });
    }

    // Verificar se o estado existe no Enum do Prisma
    if (!Object.values(EstadoAgendamento).includes(estado)) {
      return res.status(400).json({
        mensagem: "Estado de agendamento inválido.",
        estadosDisponiveis: Object.values(EstadoAgendamento)
      });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        estado
      },

      include: includePsicologo,

      orderBy: {
        data: "desc"
      }
    });

    return res.status(200).json({
      total: agendamentos.length,
      agendamentos
    });

  } catch (error) {
    console.error("Erro ao filtrar por estado:", error);

    return res.status(500).json({
      mensagem: "Erro ao consultar agendamentos."
    });
  }
};

export const filtrarAgendamentoPorNomePsicologo = async (req: Request, res:Response):Promise <any> => {
  try {
    const { nome } = req.query;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        mensagem: "Informe o nome do psicólogo."
      });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        psicologo: {
          is: {
            user: {
              is: {
                OR: [
                  {
                    nome: {
                      contains: nome.trim(),
                      mode: "insensitive"
                    }
                  },
                  {
                    sobrenome: {
                      contains: nome.trim(),
                      mode: "insensitive"
                    }
                  }
                ]
              }
            }
          }
        }
      },

      include: includePsicologo,

      orderBy: {
        data: "desc"
      }
    });

    return res.status(200).json({
      total: agendamentos.length,
      agendamentos
    });

  } catch (error) {
    console.error("Erro ao filtrar por nome:", error);

    return res.status(500).json({
      mensagem: "Erro ao consultar agendamentos."
    });
  }
};

export const filtrarAgendamentoPorPsicologoId = async (req: Request, res:Response):Promise <any> => {
  try {
    const { psicologo_id } = req.params;

    if (!psicologo_id) {
      return res.status(400).json({
        mensagem: "ID do psicólogo não informado."
      });
    }

    const psicologo = await prisma.psicologo.findUnique({
      where: {
        user_id: psicologo_id
      }
    });

    if (!psicologo) {
      return res.status(404).json({
        mensagem: "Psicólogo não encontrado."
      });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        psicologo_id
      },

      include: includePsicologo,

      orderBy: [
        {
          data: "desc"
        },
        {
          horaInicio: "asc"
        }
      ]
    });

    return res.status(200).json({
      psicologo_id,
      total: agendamentos.length,
      agendamentos
    });

  } catch (error) {
    console.error("Erro ao filtrar por psicólogo:", error);

    return res.status(500).json({
      mensagem: "Erro ao consultar agendamentos."
    });
  }
};