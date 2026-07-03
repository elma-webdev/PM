import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import  { createHash } from "crypto";
import dotenv from "dotenv";
import { sendResetPasswordEmail } from "../provider/transporter";
import { BadRequest } from "../error-handler/api-error";
dotenv.config();

const prisma = new PrismaClient();

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const start=Date.now();
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
    throw new BadRequest("E-mail inexistente.");
    }

     const code = Math.floor(1000 + Math.random() * 9000);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const hashCode = createHash("sha256")
          .update(code.toString())
          .digest("hex");

   
    await prisma.passwordResetCode.create({
      data: {
        code: hashCode,
        expiresAt,
        user_id: user.id,
      },
    });

    
    await sendResetPasswordEmail(user.email, code);
    const elipsed=Date.now()-start;
    if (elipsed > 1500) {
      // await sleep(elipsed);
    }
    console.log("Se o usuário existir, o código de verificação será enviado para o e-mail.");
    res
      .status(200)
      .json({
        message:
          "Se o usuário existir, o código de verificação será enviado para o e-mail.",
      });
  } catch (error) {
    res.status(500).json({ error: "Erro interno ao processar a solicitação." });
  }
};
