import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { sendActivationProfileEmail } from "../../provider/transporter.js";
export async function AcceptPsichologist(
  req: Request,
  res: Response,
): Promise<any> {
  const {user_id} = req.params;
  try {

    const psicologo = await prisma.psicologo.update({
      where: { user_id },
      data: { status: 1 }
    });

    await sendActivationProfileEmail("psicologo@example.com");

    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
export async function RejectPsichologist(
  req: Request,
  res: Response,
): Promise<any> {
  const {user_id} = req.params;
  try {

  const psicologo = await prisma.psicologo.update({
      where: { user_id },
      data: { status: 0 }
    });


    return res.json(psicologo);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
