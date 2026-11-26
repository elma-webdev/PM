import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";

async function main() {

    const id_psicologo=await prisma.psicologo.findMany()
    const id_paciente=await prisma.paciente.findMany()
 
    console.table(id_paciente)
    console.table(id_psicologo)
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });