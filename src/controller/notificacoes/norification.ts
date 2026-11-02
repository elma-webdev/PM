import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../server.ts";

export const CreateNotification = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { user_id } = req.params;
  const { mensagem } = req.body;
  const notificacao = await prisma.notificacao.create({
    data: {
      user_id,
      mensagem,
    },
  });
  iovariable.to(userSockets[String(user_id)]).emit("notification", {
    message: `apenas ${user_id} pode ver essa notificação`,
  });
  return res.status(201).json("ok");
};

export const UnreadNotification = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { id } = req.user;
  const notReadNotification = await prisma.userNotificacao.findMany({
    where: {
      user_id: id,
      notificacao: { read: false },
    },
    orderBy: {
      notificacao:{createdAt: "desc"}
    },
    include:{
      notificacao:true
    }
  });
  return res.status(200).json(notReadNotification);
};

export const ReadNotification = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { id } = req.user;
const ReadNotifation = await prisma.userNotificacao.updateMany({
  where: {
    user_id: id,
    notificacao: {
      read: false,
    },
  },
  data: {
    read: true, // Nota: Se o campo 'read' estiver na tabela 'Notificacao', veja a observação abaixo
  },
});
  return res.status(200).json("ok");
};
