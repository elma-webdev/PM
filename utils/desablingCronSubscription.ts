import cron from "node-cron";
import { prisma } from "../lib/prisma.js";

// roda todos os dias à meia-noite
cron.schedule("0 0 * * *", async () => {
  console.log("Verificando subscrições vencidas...");

  const now = new Date();

  // busca subscrições ativas cujo fim ainda está vazio
  const subscricoesAtivas = await prisma.subscricao.findMany({
    where: {
      status: 1,
      fim: null,
    },
    include: { plano: true },
  });

  for (const sub of subscricoesAtivas) {
    const inicio = new Date(sub.createdAt);
    const fimCalculado = new Date(inicio);
    fimCalculado.setMonth(fimCalculado.getMonth() + sub.plano.duracao);

    if (now >= fimCalculado) {
      await prisma.subscricao.update({
        where: { subsc_id: sub.subsc_id },
        data: {
          status: 0, 
          fim: now,  
        },
      });
      console.log(`Subscrição ${sub.subsc_id} concluída.`);
    }
  }
});
