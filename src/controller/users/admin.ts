import { Request, Response } from "express";
import { prisma } from "../../../lib/prisma.js";
import { createLog } from "../../../utils/fcuntion.log.js";
import { ApiError, Conflict } from "../../error-handler/api-error.js";
import { createHash } from "node:crypto";
import { userSchema } from "./types/types.users.js";
import { ZodError } from "zod";
import { Rss } from "lucide-react";

export async function createAdmin(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    // const parsed = userSchema.parse(req.body);
    // console.log(parsed);
    const { nome, email, password, sobrenome, role, photo } = req.body;

    const doesUserExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (doesUserExist) {
      throw new Conflict("Usuário já cadastrado no sistema.");
    }

    const hashPassword = createHash("sha256").update(password).digest("hex");
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role,
        nome,
        sobrenome,
      },
    });

    console.log(user);
    return res.status(201).json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err);
      return res.status(500).json({ message: err.message });
    }
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}
