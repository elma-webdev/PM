import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { createHash } from "crypto";
import { BadRequest } from "../error-handler/api-error";
const prisma = new PrismaClient();

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { email, code, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new BadRequest("Usuário não encontrado.");
    const hashCode = createHash("sha256").update(code.toString()).digest("hex");

    // 1. Buscar o código mais recente válido para esse usuário
    const Code = await prisma.passwordResetCode.findFirst({
      where: {
        user_id: user.id,
        code: hashCode,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!Code) throw new BadRequest("Código inválido.");

    if (Code.expiresAt < new Date()) throw new BadRequest("Código expirado.");

    // 2. Fazer hash da nova senha
    const hashedPassword = createHash("sha256")
      .update(newPassword)
      .digest("hex");

    // 3. Atualizar a senha e APAGAR os códigos usados (Transaction)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetCode.deleteMany({
        where: { user_id: user.id },
      }),
    ]);

    res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao redefinir a senha." });
  }
};
