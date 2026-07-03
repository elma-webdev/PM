import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function createLog(
  mensagem: string,
  tipo: number,
  usuarioId: string
): Promise<any> {
  try{
    
    await prisma.logatividade.create({
      data: {
        mensagem,
        tipo,
        user_id:usuarioId
      },
    });
  }catch(err){
    console.log(err)
  }

}   