import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
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
  iovariable.to(userSockets[user_id]).emit("notification", {
    message: `apenas ${user_id} pode ver essa notificação`,
  });
  return res.status(201).json("ok");
};

export const UnreadNotification = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { user_id } = req.params;
  const notReadNotification = await prisma.notificacao.findMany({
    where: {
      user_id,
    },
    orderBy: {
      created_at: "desc",
    }
  });
  return res.status(200).json(notReadNotification);
};

export const ReadNotification = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { user_id } = req.params;
  const ReadNotifation = await prisma.notificacao.update({
    where: {
      user_id,
    },
    data:{ read: true}
  });
  return res.status(200).json("ok");
};
