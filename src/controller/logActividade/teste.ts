import { Request, Response } from "express";


import { prisma } from "../../../lib/prisma.js";
import { iovariable } from "../../server.ts";


export const ApenasAdmin = async (req: Request, res: Response): Promise<any> => {
    iovariable.to("admins").emit("notification", {
    message: "Apenas admins podem ver",
  });
  
}

