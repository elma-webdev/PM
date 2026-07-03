import { BadRequest } from "../../error-handler/api-error";
import { prisma } from "../../../lib/prisma";
import { Request, Response } from "express";



export const getLogPage = async (req: Request, res: Response): Promise<any> => {

  try {

    const currentPage = parseInt(req.query.page as string) || 1;

    //registros por página
    const limit = parseInt(req.query.limit as string) || 10;
    const search = parseInt(req.query.search as string) || undefined;

    //saltos
    const offset: number = (currentPage - 1) * limit;
  
    const whereClause = search ? { tipo: search} : {};

    const totalItems = await prisma.logatividade.count({
       where: whereClause,
     });
    const totalPages = Math.ceil(totalItems / limit);

    const logs = await prisma.logatividade.findMany({
        orderBy: { data: "desc" },
        where: whereClause,
        take: limit,
        skip: offset,   
      });

    return res
      .status(200)
      .json({
        logs,
        metadata: { currentPage, offset, totalItems, totalPages },
      });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
};

