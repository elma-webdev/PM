import { prisma } from "../../lib/prisma.js";
import { Request, Response } from "express";
import { createHash } from "crypto";
import { ApiError, BadRequest } from "../error-handler/api-error.js";
import bcrypt from "bcrypt";
import z from "zod";


const z_reset_code=z.object({
   email: z
   .email("Endereço de email inválido.")
   .trim()
   .min(1, "Email é obrigatório."),
  code:z.string().trim().length(4, "O código deve ter 4 dígitos.").regex(/^\d{4}$/, "O código deve conter apenas números."),
    password: z
      .string()
      .trim()
      .min(
        8,
        "A senha deve conter no mínimo 8 carateres, incluindo letras maiusculas, minúsculas, números e caracteres especiais.",
      )
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-+])[A-Za-z\d@$!%*?&_#\-+]{8,}$/,
        "A senha deve conter no mínimo 8 carateres, incluindo letras maiusculas, minúsculas, números e caracteres especiais.",
      )
      .nonempty("A senha é obrigatória"),
})

export const resetPassword = async (
  req: Request,
  res: Response,
): Promise<any> => {

  const validar_campo=z_reset_code.safeParse(req.body)

  if(!validar_campo.success){
    return res.status(400).json({
      message:z.flattenError(validar_campo.error).fieldErrors
    })
  }
  const { email, code, password } = validar_campo.data;

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
    
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // 3. Atualizar a senha e APAGAR os códigos usados (Transaction)
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword },
      }),
      prisma.passwordResetCode.deleteMany({
        where: { user_id: user.id },
      }),
    ]);

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(500).json({ message: error.message });
    }
    if (error instanceof z.ZodError) {
            return res.status(400).json({
              mensagem: "Dados inválidos.",
              erros: error.message
            });
    }
    return res.status(500).json({ error: "Erro ao redefinir a senha." });
  }
};
