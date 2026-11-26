import { z } from "zod";
import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.ts";
import { iovariable, userSockets } from "../../server.ts";
import { BadRequest, Unauthorized } from "../../error-handler/api-error.ts";
import { criarMensagemSchema, listarMensagensParamsSchema } from "./types/mensagem.schema.ts";
import { includeUsuariosMensagem } from "../../../helpers/mensagem.helpers.ts";


export const criarMensagem = async (req: Request, res: Response): Promise<any> => {
  try {
    const remetente_id = req.user?.id;
    if (!remetente_id) {
      throw new Unauthorized("Utilizador não autenticado.");
    }

    const dados = criarMensagemSchema.parse(req.body);

    // Impede enviar mensagem para si mesmo
    if (remetente_id === dados.destinatario_id) {
        throw new BadRequest("Não é possível enviar mensagem para si mesmo.")
    }

    // Confirma que o destinatário existe
    const destinatarioExiste = await prisma.user.findUnique({
      where: { id: dados.destinatario_id },
      select: { id: true },
    });

    if (!destinatarioExiste) {
      return res.status(404).json({
        mensagem: "Destinatário não encontrado.",
      });
    }

    // Cria a mensagem trazendo os dados do remetente e destinatário
    const mensagem = await prisma.mensagem.create({
      data: {
        remetente_id,
        destinatario_id: dados.destinatario_id,
        conteudo: dados.conteudo || null,
        file: dados.file || null,
      },
      include: includeUsuariosMensagem,
    });

    // Emite em tempo real via Socket.IO se o destinatário estiver online
   const socketDestinatario = userSockets[dados.destinatario_id];

   if (socketDestinatario) {
    iovariable.to(socketDestinatario).emit("nova_mensagem", mensagem);
   }

    return res.status(201).json({
      mensagem: "Mensagem enviada com sucesso.",
      dados: mensagem,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        mensagem: "Dados inválidos.",
        erros: error.message
      });
    }

    console.error("Erro ao criar mensagem:", error);
    return res.status(500).json({
      mensagem: "Erro interno ao enviar mensagem.",
    });
  }
};

export const listarMensagens = async (req: Request, res: Response): Promise<any> => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      throw new Unauthorized("Utilizador não autenticado.");
    }

    // Recebe o ID da outra pessoa da conversa via params (ex: GET /mensagens/:outro_user_id)
    const { outro_user_id } = listarMensagensParamsSchema.parse(req.params);

    // Marca automaticamente como lidas as mensagens enviadas pela outra pessoa para mim
    await prisma.mensagem.updateMany({
      where: {
        remetente_id: outro_user_id,
        destinatario_id: user_id,
        lida: false,
      },
      data: {
        lida: true,
        dataLeitura: new Date(),
      },
    });

    // Busca todo o histórico nos dois sentidos (enviadas e recebidas) ordenado da mais antiga para a mais recente
    const mensagens = await prisma.mensagem.findMany({
      where: {
        OR: [
          { remetente_id: user_id, destinatario_id: outro_user_id },
          { remetente_id: outro_user_id, destinatario_id: user_id },
        ],
      },
      include: includeUsuariosMensagem,
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.status(200).json({
      total: mensagens.length,
      mensagens,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        mensagem: "Parâmetro inválido.",
        erros: error.flatten().fieldErrors,
      });
    }

    if (error instanceof Unauthorized) {
      return res.status(401).json({ mensagem: error.message });
    }

    console.error("Erro ao listar mensagens:", error);
    return res.status(500).json({
      mensagem: "Erro interno ao carregar mensagens.",
    });
  }
};