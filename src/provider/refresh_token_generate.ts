import crypto from "crypto"
import dayjs from "dayjs"
import { prisma } from "../../lib/prisma.js";
import dotenv from "dotenv";
dotenv.config();


export const refresh_token = async (
  userId: string,
  ip: string,
  user_agent: string
) => {
  const expiresIn = dayjs().add(604800, "second").unix();
  const newRefreshToken = await prisma.refreshToken.create({
    data: {
      user_id: userId,
      refresh: crypto.randomUUID(),
      user_agent,
      ip,
      expiresIn,
    },
  });

  return newRefreshToken;
};

// const newRefreshToken = await prisma.refreshToken.upsert({
//   where: { userId_deviceId: { userId, deviceId } }, // precisa da constraint @@unique
//   update: {
//     refresh: crypto.randomUUID(),
//     ip,
//     expiresIn: dayjs().add(30, "day").unix(),
//   },
//   create: {
//     userId,
//     deviceId,
//     refresh: crypto.randomUUID(),
//     ip,
//     expiresIn: dayjs().add(30, "day").unix(),
//   },
// });
// @@unique([userId, deviceId])