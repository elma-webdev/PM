import {PrismaClient, TipoLog} from '../src/generated/prisma'
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createLog(
  mensagem: string,
  tipo: TipoLog,
  usuarioId: number
): Promise<any> {
  const log = await prisma.logAtividade.create({
    data: {
      mensagem,
      tipo,
      usuarioId,
    },
  });
  return log;
}   
console.log(createLog);