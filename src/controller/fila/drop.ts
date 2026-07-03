import { PrismaClient } from "../../generated/prisma";
const prisma = new PrismaClient();

export async function dropFila() {
    // await prisma.fila.deleteMany({
    // });
    await prisma.triagem.deleteMany({
    });
}
dropFila()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });