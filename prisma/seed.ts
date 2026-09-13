import { prisma } from "../lib/prisma.js";
import { createHash } from "crypto";
async function Seed() {
  console.log("AQUI");
  // d543d30a-1249-4c00-af2e-394493efdacd
  //bb0d208c-4021-4901-8741-a5ec63419ec5

  // const pacientes = await prisma.paciente.findMany();

  // for (const paciente of pacientes) {
  //     const asksession = await prisma.sessao.updateMany({
  //       data: {
  //         paciente_id: paciente.user_id,
  //         psicologo_id: "bb0d208c-4021-4901-8741-a5ec63419ec5",
  //         modo_sessao: 1,
  //         status:5
  //       },
  //     });
 
      // const asksession = await prisma.pagamento.updateMany({
      //   data: {
      //     referencia: "012784901",
      //   },
      // });

      // const psicologos=await prisma.psicologo.updateMany({
      //   data:{
      //   bio: "Biografia disponível para todos verem.",
      //   sexo: 1,
      //   contacto: "+244 999999999",
      //   idiomas: "Português",
      //   nbi: "123456789",
      //   grau_academico: "Licenciatura",
      //   especialidade: "Psicologia Clínica",
      //   nacionalidade: "Angolana",
      //   universidade: "Universidade Agostinho Neto",
      //   ano_conclusao: 2019,
      //   ano_experiencia: 10,
      //   modalidade: 3
      //   }
      // })
      const psicologos = await prisma.psicologo.findMany({})
      console.log(psicologos);
  


}

Seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
