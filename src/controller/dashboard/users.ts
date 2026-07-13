import { Request, Response } from "express";
import { ApiError } from "../../error-handler/api-error.js";
import { prisma } from "../../../lib/prisma.js";

export async function getAllUsers(req: Request, res: Response): Promise<any> {
  try {
    const totalPsicologos = await prisma.psicologo.count({});
    const totalPacientes = await prisma.paciente.count({});
    return res.status(200).json({ totalPsicologos, totalPacientes, totalUsers: totalPsicologos + totalPacientes });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function AllUsersPerMonth(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const month = parseInt(req.query.month as string) || new Date().getMonth();
    const year = new Date().getFullYear();
    const totalPsicologosMonth = await prisma.psicologo.count({
      where: {
        createdAt: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
    });

    const totalPacientesMonth = await prisma.paciente.count({
      where: {
        createdAt: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
    });
    return res.status(200).json({ totalPsicologosMonth, totalPacientesMonth });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function AllUsersPerYear(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const year = parseInt(req.query.year as string) || new Date().getFullYear();
    const totalPsicologos = await prisma.psicologo.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });
    const totalPacientes = await prisma.paciente.count({
      where: {
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        },
      },
    });
    return res.status(200).json({ totalUsers: totalPsicologos + totalPacientes });
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
