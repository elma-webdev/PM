import { createLog } from "../../../utils/fcuntion.log";
import { BadRequest, NotFound } from "../../error-handler/api-error";
import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";
import client from "../../provider/redisConfig";
import { iovariable } from "../..";
export const createFila = async (req: Request, res: Response): Promise<any> => {

};
export const getFila = async (req: Request, res: Response): Promise<any> => {
    try {
      const totalNaFila = await client.zRange("fila_espera", 0, -1);

      return res.json({ total: totalNaFila });
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(500).json({ message: err.message });
      }
      return res.status(500).json({ message: "Erro desconhecido." });
    }
};

export const getMyposition = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.user;

  try {
    // 2. Buscamos o rank (índice baseado em 0) do usuário no Sorted Set do Redis
    const rank = await client.zRank("fila_espera", id.toString()) ;

    if (rank === null) throw new NotFound("Você não está na fila de espera ativa no momento. ");
      
    console.log(rank, id)
    // 4. Buscamos a quantidade total de elementos presentes na estrutura do Redis
    const totalNaFila = await client.zCard("fila_espera");

    // 5. Calculamos a posição real (humanizada, começando de 1)
    const posicaoReal = rank + 1;

    // 6. Retornamos a resposta ultrarrápida
    return res.status(200).json({
      usuarioId: id,
      posicao: posicaoReal,
      totalNaFila: totalNaFila,
      tempoEstimadoMinutos: posicaoReal * 5, // Opcional: ex, 5 minutos por pessoa
    });
  } catch (err: unknown) {
    console.error("Erro ao buscar posição na fila do Redis:", err);
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res
      .status(500)
      .json({ message: "Erro interno ao processar a fila." });
  }
};