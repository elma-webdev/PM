import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
import client from "../../provider/redisConfig.js";
import redis from "redis";
import dotenv from "dotenv";

dotenv.config();
const MarcarSessaoInstantanea = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { id } = req.user;
  const { psicologo_id } = req.params;
  const { agenda_id } = req.body;

  try {
    const doesAgendaExist = await prisma.agenda_psicologo.findUnique({
      where: { agenda_id },
    });

    if (!doesAgendaExist) {
      throw new Error("Agenda não encontrada.");
    }

    // const agenda = await prisma.agenda_psicologo.update({
    //   where: { agenda_id },
    //   data: { disponibilidade: false },
    // });
    // console.log("Agenda atualizada:", agenda);

    const doesSessionExists = await prisma.sessao.findFirst({
      where: {
        psicologo_id: psicologo_id,
        paciente_id: id,
        status: 5, // pendente
      },
    });

    if (doesSessionExists) {
      return res.status(400).json({
        message: "Você já possui uma sessão pendente com este psicólogo",
      });
    }

    const sessao = await prisma.sessao.create({
      data: {
        psicologo_id: psicologo_id,
        paciente_id: id,
        status: 5, // pendente
        modo_sessao: 0,
        //inicio: dataHora,  instantânea- na hora
      },
    });

    const notificacao = await prisma.userNotificacao.create({
      data: {
        user: {
          connect: { id: psicologo_id },
        },
        notificacao: {
          create: {
            mensagem: " Um paciente solicitou uma sessão instantânea.",
          },
        },
      },
    });

    return res.json({
      notificacao,
      sessao,
    });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};
const AgendarSessao = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.user;
  const { psicologo_id, modo } = req.params;
  const { agenda_id, dataHora } = req.body;

  let modoSessao: number;

  switch (modo) {
    case "1":
      modoSessao = 1;
      break;
    case "2":
      modoSessao = 2;
      break;
    default:
      modoSessao = 0;
  }

  try {
     const doesAgendaExist = await prisma.agenda_psicologo.findUnique({
      where: { agenda_id },
    });

    if (!doesAgendaExist) {
      throw new Error("Agenda não encontrada.");
    }

    const agenda = await prisma.agenda_psicologo.update({
      where: { agenda_id },
      data: { disponibilidade: false },
    });
    console.log("Agenda atualizada:", agenda);

    const doesSessionExists = await prisma.sessao.findFirst({
      where: {
        psicologo_id: psicologo_id,
        paciente_id: id,
        status: 5, // pendente
      },
    });

    if (doesSessionExists) {
      return res
        .status(400)
        .json({
          message: "Você já possui uma sessão pendente com este psicólogo",
        });
    }

    const sessao = await prisma.sessao.create({
      data: {
        psicologo_id: psicologo_id,
        paciente_id: id,
        status: 5, // pendente
        modo_sessao: modoSessao,
        inicio:dataHora
      },
    });
    const notificacao = await prisma.userNotificacao.create({
      data: {
        user: {
          connect: { id: psicologo_id },
        },
        notificacao: {
          create: {
            mensagem:
              " Um paciente solicitou uma sessão agendada. Por favor, verifique a sua agenda para aceitar ou rejeitar o atendimento.",
          },
        },
      },
    });

    return res.json({
      notificacao,
      sessao,
    });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};

export { MarcarSessaoInstantanea, AgendarSessao };
