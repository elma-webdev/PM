import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
import client from "../../provider/redisConfig.js";
import { generateZoomMeeting } from "../../provider/zoom-service.js";
import { ocuparSlot } from "../agenda/agenda.js";

export const SessaoByPsicologo = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { psicologo_id } = req.params;
    const sessoes = await prisma.sessao.findMany({
      where: { psicologo_id },
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
    return res.status(200).json(sessao);
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
  }
};
export const PagarSessao = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    let meeting: any;
    const { psicologo_id } = req.params;
    const { sessao_id, inicio } = req.body;
    await ocuparSlot(psicologo_id, inicio);
    const confirmarPagamento = await prisma.pagamento.update({
      where: { sessao_id },
      data: { status: 1 },
    });
    const existsSessao = await prisma.sessao.findUnique({
      where: { sessao_id },
    });

    if (existsSessao?.modo_sessao === 0) {
      meeting = await generateZoomMeeting();
      const sessao = await prisma.sessao.update({
        where: { sessao_id },
        data: { status: 1, inicio: new Date(), extra_data: { guest: meeting.join_url, host: meeting.start_url, password: meeting.password} }
      });
      await prisma.notificacao.create({
        data: {
          user_id: sessao.psicologo_id,
          mensagem: `Sua sessão começou agora. Link: ${meeting.start_url}`,
        },
      });
      await prisma.notificacao.create({
        data: {
          user_id: sessao.paciente_id,
          mensagem: `Sua sessão começou agora. Entre através do link de sessão: ${meeting.join_url}`,
        },
      });
      return res.status(200).json({ sessao: sessao });
    } else if (existsSessao?.modo_sessao === 1) {
      meeting = await generateZoomMeeting(new Date(inicio), 2);
      const sessao = await prisma.sessao.update({
        where: { sessao_id },
        data: { status: 2, link_meet: meeting.join_url, inicio: new Date(inicio) }
      });

      await prisma.notificacao.create({
        data: {
          user_id: sessao.paciente_id,
          mensagem: `Sua sessão está marcada para o dia ${sessao.inicio}.`
        },
      });
      return res.status(200).json({ sessao: sessao });
    }
    const sessao = await prisma.sessao.update({
      where: { sessao_id },
      data: { status: 2, inicio:new Date(inicio)},
    });

    const notificacao = await prisma.notificacao.create({
      data: {
        user_id: sessao.paciente_id,
        mensagem: `Sua sessão está marcada para ${sessao.inicio} no consultório.`,
      },
    });
    // const meetingPayload = {
    //   id: meeting.id,
    //   join_url: meeting.join_url,
    //   password: meeting.password,
    //   start_url: meeting.start_url,
    //   created_at: meeting.created_at,
    //   agenda: meeting.agenda,
    //   host_id: meeting.host_id,
    //   host_email: meeting.host_email,
    //   type: meeting.type,
    //   status: meeting.status,
    //   topic: meeting.topic,
    //   duration: meeting.duration,
    // };

    return res.status(200).json({ sessao: sessao });
  } catch (err: unknown) {
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

    await prisma.pagamento.create({
      data: {
        sessao_id,
        status: 2,
        observacao: "Marcação de consulta",
        refrencia: "012784901",
        quantia,
      },
    });

    const mensagem =
      sessao.modo_sessao === 0
        ? `O psicólogo aceitou a solicitação de sessão instantanea. Confirme o pagamento para ser atendido. ` : `O psicólogo aceitou a solicitação de sessão por agenda. Verifique a agenda do psicólogo, escolha o melhor horário e confirme o pagamento para ser atendido.`;

    const paciente_id = sessao.paciente_id;
    iovariable.to(userSockets[paciente_id]).emit("notification_pareamento", {
      message: "Nova notificação do sistema.",
    });

    const notificacao = await prisma.notificacao.create({
      data: {
        user_id: paciente_id,
        mensagem: mensagem,
      },
    });

    return res.status(200).json({ sessao: sessao, notificacao: notificacao });
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
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
      data: { fim: new Date(), status: 1 },
    });

    return res.status(200).json(sessao);
  } catch (err: unknown) {
    return res.status(500).json({ error: err });
  }
};
