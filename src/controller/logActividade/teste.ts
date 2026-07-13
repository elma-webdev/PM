import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export const CreateNotification = async (req: Request, res: Response): Promise<any>=> {
  const {mensagem} = req.body
    const t=await prisma.notificacao
    .create({
      data:{ 
        user_id:"0546331d-3e13-43c5-8b33-903c7aa885ad",
        mensagem,
      }
    })

    iovariable.to("pacientes").emit("notification", {
        message: "Apenas pacientes podem ver esta notificacao",
      });
    return res.status(201).json(t)
  
}
export const ApenasAdmin = async (req: Request, res: Response): Promise<any> => {
    iovariable.to("admins").emit("notification", {
    message: "Apenas admins podem ver",
  });
}

export const UnreadNotification = async (req: Request, res: Response): Promise<any>=> {
  const notReadNotifation = await prisma.notificacao.findMany({
    where: {
      read: false,
    },
  });
  return res.status(200).json(notReadNotifation)
}