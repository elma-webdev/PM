import jsonwebtoken from "jsonwebtoken";
import dayjs from "dayjs";
import { BadRequest } from "../error-handler/api-error";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const RefreshToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { refresh } = req.body;

    let newRefreshToken;
    const userAgent = req.get("User-Agent") || "unknown-agent";
    const ip = req.ip || "unknown-ip";
    const user_agent = `${userAgent}-${ip}`;

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(refresh)) {
        throw new BadRequest("Formato do refresh token inválido");
      }


      //Verificar se o refresh token ainda existe
    const is_refresh_token = await prisma.refreshToken.findFirst({
      where: {
        refresh: refresh,
      },
      include: {
        user: true,
      },
    });

    if (!is_refresh_token) {
      console.log("aqui")
      throw new BadRequest("Refresh token inválido");
    }

    // se expirou, fazer login novamente
    if (dayjs().unix() > is_refresh_token.expiresIn) {
      await prisma.refreshToken.delete({
        where:{
          token_id: is_refresh_token.token_id,
          user_agent: is_refresh_token.user_agent
        }
      })
      console.log("Refresh token expirado, faz login de novo");
      throw new BadRequest("Refresh token expirado. Faça login novamente.");
    }


    // prossiga c o accao 
    const token = jsonwebtoken.sign(
      {
        id: is_refresh_token.user.id,
        role: is_refresh_token.user.role,
        nome: is_refresh_token.user.nome,
      },
      process.env.SCT as string,
      { expiresIn: "5min" }
    );


    // apaga o refresh token antigo e cria um novo
      await prisma.refreshToken.delete({
        where: {
          token_id: is_refresh_token.token_id,
          user_agent: is_refresh_token.user_agent,
        },
      });
       newRefreshToken = await prisma.refreshToken.create({
         data: {
           refresh: crypto.randomUUID(),
           expiresIn: dayjs().add(604800, "second").unix(),
           ip,
           user_agent: user_agent,
           user_id: is_refresh_token.user.id
         },
       });

    return res.status(200).json({ token, newRefreshToken });
  } catch (error) {
    console.log(error);
    throw new BadRequest("Refresh token inválido");
  }
};
