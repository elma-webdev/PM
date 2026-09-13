import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
import client from "../../provider/redisConfig.js";
import { generateZoomMeeting } from "../../provider/zoom-service.js";
import { ocuparSlot } from "../agenda/agenda.js";
import { Conflict, NotFound } from "../../error-handler/api-error.js";

export const SessaoRequestByPsicologo = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { psicologo_id } = req.params;
    const sessoes = await prisma.sessao.findMany({
      where: {
        psicologo_id,
        pagamentos: { none: {} },
      },
      include: {
        paciente: {
          select: {
            user: {
              select: {
                nome: true,
                email: true,
                sobrenome: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(sessoes);
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const AcceptSessoes = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { sessao_id, quantia } = req.body;
    const sessao = await prisma.sessao.findUnique({
      where: { sessao_id },
    });
    if (!sessao) throw new NotFound("Sessão não encontrada.");

    await prisma.pagamento.create({
      data: {
        sessaoId: sessao_id,
        status: 2,
        observacao: "Marcação de consulta",
        referencia: "012784901",
        quantia,
      },
    });

    const mensagem =
      sessao.modo_sessao === 0
        ? `O psicólogo aceitou a solicitação de sessão instantanea. Confirme o pagamento para ser atendido. `
        : `O psicólogo aceitou a solicitação de sessão por agenda. Verifique a agenda do psicólogo, escolha o melhor horário e confirme o pagamento para ser atendido.`;

    const paciente_id = sessao.paciente_id;
    iovariable.to(userSockets[paciente_id]).emit("notification_pareamento", {
      message: "Nova notificação do sistema.",
    });

    const notificacao = await prisma.userNotificacao.create({
      data: {
        user: {
          connect: { id: paciente_id },
        },
        notificacao: {
          create: {
            mensagem: mensagem,
          },
        },
      },
      include: {
        notificacao: true,
      },
    });

    return res.status(200).json({ notificacao: notificacao });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};

export const GetAllPsicologoSessaoRequestAccepted = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { psicologo_id } = req.params;
    const sessoes = await prisma.sessao.findMany({
      where: {
        psicologo_id,
        pagamentos: {
          some: {},
        },
      },
      include: {
        pagamentos: true,
        paciente: {
          select: {
            user: {
              select: {
                nome: true,
                email: true,
                sobrenome: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(sessoes);
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
  }
};
export const DenySessao = async (req: Request, res: Response): Promise<any> => {
  try {
    const { sessao_id } = req.body;
    const sessao = await prisma.sessao.update({
      where: { sessao_id },
      data: { status: 0 },
    });
    return res.status(200).json("ok");
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};

export const FinishSessao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { sessao_id } = req.body;
    const sessao = await prisma.sessao.update({
      where: { sessao_id },
      data: { fim: new Date(), status: 3 },
    });

    return res.status(200).json({ message: "sessão finalizada" });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};

export const SessaoRequestByPaciente = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { paciente_id } = req.params;
    console.log("paciente_id", paciente_id);

    const paciente = await prisma.paciente.findUnique({
      where: { user_id: paciente_id }, //
    });
    const userId = paciente ? paciente.user_id : paciente_id;
    const sessoes = await prisma.sessao.findMany({
      where: {
        paciente_id: userId,
        pagamentos: { none: {} },
      },
      include: {
        pagamentos: true,
        psicologo: {
          select: {
            user: {
              select: {
                nome: true,
                email: true,
                sobrenome: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(sessoes);
  } catch (err: unknown) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const PaySessao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    let meeting: any;

    const { sessao_id } = req.params;

    const doesPaymentExists = await prisma.pagamento.findFirst({
      where: { sessaoId: sessao_id, status: 1 },
    });

    if (doesPaymentExists) throw new Conflict("Pagamento já realizado");

    const confirmarPagamento = await prisma.pagamento.update({
      where: { sessaoId: sessao_id },
      data: { status: 1 },
    });

    const existsSessao = await prisma.sessao.findUnique({
      where: { sessao_id },
    });

    if (existsSessao?.modo_sessao === 0) {
      meeting = await generateZoomMeeting();
      const sessao = await prisma.sessao.update({
        where: { sessao_id },
        data: {
          status: 1, //iniciada
          inicio: new Date(),
          extra_data: {
            guest: meeting.join_url,
            host: meeting.start_url,
            password: meeting.password,
          },
        },
      });

      await prisma.userNotificacao.create({
        data: {
          user: {
            connect: { id: sessao.psicologo_id },
          },
          notificacao: {
            create: {
              mensagem: `Sua sessão começa agora. Link: ${meeting.start_url}`,
            },
          },
        },
      });

      await prisma.userNotificacao.create({
        data: {
          user: {
            connect: { id: sessao.paciente_id },
          },
          notificacao: {
            create: {
              mensagem: `Sua sessão começa agora. Entre através do link de sessão: ${meeting.join_url}`,
            },
          },
        },
      });

      return res.status(200).json({ sessao: sessao });
    } else if (existsSessao?.modo_sessao === 1) {
      meeting = await generateZoomMeeting(new Date(existsSessao.inicio), 2);

      const sessao = await prisma.sessao.update({
        where: { sessao_id },
        data: {
          status: 2,
          link_meet: meeting.join_url,
        },
      });
      await prisma.userNotificacao.create({
        data: {
          user: {
            connect: { id: sessao.paciente_id },
          },
          notificacao: {
            create: {
              mensagem: `Sua sessão está marcada para o dia ${sessao.inicio}.`,
            },
          },
        },
      });

      return res.status(200).json({ sessao: sessao });
    }
    const sessao = await prisma.sessao.update({
      where: { sessao_id },
      data: { status: 2, inicio: new Date(existsSessao.inicio) },
    });

    await prisma.userNotificacao.create({
      data: {
        user: {
          connect: { id: sessao.paciente_id },
        },
        notificacao: {
          create: {
            mensagem: `Sua sessão está marcada para ${sessao.inicio} no consultório.`,
          },
        },
      },
    });

    return res.status(200).json({ sessao: sessao });
  } catch (err: any) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    } else {
      return res.status(500).json({ message: err });
    }
  }
};

export const GetAllPacienteSessaoRequestAccepted = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { paciente_id } = req.params;
    const sessoes = await prisma.sessao.findMany({
      where: {
        paciente_id,
        pagamentos: {
          some: {},
        },
      },
      include: {
        pagamentos: true,
        psicologo: {
          select: {
            user: {
              select: {
                nome: true,
                email: true,
                sobrenome: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json(sessoes);
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
  }
};
export const SessaoPaid = async (req: Request, res: Response): Promise<any> => {
  try {
    const { psicologo_id } = req.params;
    const sessoes = await prisma.sessao.findMany({
      where: {
        psicologo_id,
        pagamentos: {
          status: 1,
        },
      },
      include: { pagamentos: true },
    });
    return res.status(200).json("paga");
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
  }
};