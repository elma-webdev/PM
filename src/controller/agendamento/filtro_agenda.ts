import { prisma } from "../../../lib/prisma.ts";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../server.ts";
import dotenv from "dotenv";
import { EstadoAgendamento } from "../../../generated/prisma/enums.ts";
import {  estado_schema, nome_schema, psicologo_id_schema } from "./types/agenda.schema.ts";
import z from "zod";

dotenv.config();

export const filtrarAgendamentoPorEstado = async (req: Request, res:Response):Promise <any> => {
  try {
    
    const estado = estado_schema.safeParse(req.body);
 
    if (!estado.success) {
      return res.status(400).json({
        mensagem: estado.error?.message
      });
    }
    const estadoValido=estado.data
   
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        estado:estadoValido
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
      },
      orderBy: {
        dataInicio: "asc"
      }
    });

    return res.status(200).json({
      total: agendamentos.length,
      agendamentos
    });

  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(400).json({
            mensagem: "Dados inválidos.",
            erros: error.message
          });
        }
    console.error("Erro ao filtrar por estado:", error);
     return res.status(500).json({
      mensagem: "Erro ao consultar agendamentos."
    });
  }
};

export const filtrarAgendamentoPorNomePsicologo = async (req: Request, res:Response):Promise <any> => {
  try {
    const nome = nome_schema.safeParse(req.query)

    if (!nome.success){
      return res.status(400).json({ mensagem: nome.error?.message})
    }

    const nomeValido = nome.data

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        psicologo: {
          is: {
            user: {
              is: {
                OR: [
                  {
                    nome: {
                      contains: nomeValido,
                      mode: "insensitive"
                    }
                  },
                  {
                    sobrenome: {
                      contains: nomeValido,
                      mode: "insensitive"
                    }
                  }
                ]
              }
            }
          }
        }
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
      },
      orderBy: {
        dataInicio: "asc"
      }
    });

    return res.status(200).json({
      total: agendamentos.length,
      agendamentos
    });

  } catch (error) {
      if (error instanceof z.ZodError) {
          return res.status(400).json({
            mensagem: "Dados inválidos.",
            erros: error.message
          });
        }
    console.error("Erro ao filtrar por nome:", error);
    return res.status(500).json({
      mensagem: "Erro ao consultar agendamentos."
    });
  }
};

export const filtrarAgendamentoPorPsicologoId = async (req: Request, res:Response):Promise <any> => {
  try {

    const psicologo_id= psicologo_id_schema.safeParse(req.params);

    if (!psicologo_id.success) {
      return res.status(400).json({
        mensagem: "ID do psicólogo não informado."
      });
    }
    
    const id_Valido=psicologo_id.data
    const psicologo = await prisma.psicologo.findUnique({
      where: {
        user_id: id_Valido
      }
    });

    if (!psicologo) {
      return res.status(404).json({
        mensagem: "Psicólogo não encontrado."
      });
    }

    const agendamentos = await prisma.agendamento.findMany({
      where: {
        psicologo_id:id_Valido
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
      },
      orderBy: 
        {
          dataInicio: "desc"
        }
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