import { Request, Response } from "express";
import { iovariable, userSockets } from "../../index.js";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma.js";


export const ApenasAdmin = async (req: Request, res: Response): Promise<any> => {
    iovariable.to("admins").emit("notification", {
    message: "Apenas admins podem ver",
  });
}

