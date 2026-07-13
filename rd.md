// routes/matchRoutes.ts
import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

// 🔹 Parear paciente com psicólogo disponível
router.post("/parear", async (req: any, res) => {
  const { pacienteId } = req.body;

  try {
    // 1. Buscar psicólogo disponível (isLogged = true, com limite > 0)
    const psicologoDisponivel = await prisma.agenda_psicologo.findFirst({
      where: {
        isLogged: true,
        status_disponibilidade: true,
        limiteAtendimento: { gt: 0 },
      },
      include: { psicologo: true },
    });

    if (!psicologoDisponivel) {
      return res.status(404).json({ error: "Nenhum psicólogo disponível agora" });
    }

    // 2. Reduzir limite de atendimento (psicólogo aceitou 1 paciente)
    await prisma.agenda_psicologo.update({
      where: { id: psicologoDisponivel.id },
      data: {
        limiteAtendimento: { decrement: 1 },
      },
    });

    // 3. (Opcional) Criar sessão entre paciente e psicólogo
    const sessao = await prisma.sessao.create({
      data: {
        pacienteId,
        psicologoId: psicologoDisponivel.psicologo.psycId,
        status: "ATIVA",
      },
    });

    // 4. Avisar frontend em tempo real via WebSocket
    req.io.emit("pareamento", {
      pacienteId,
      psicologoId: psicologoDisponivel.psicologo.psycId,
      sessaoId: sessao.id,
    });

    return res.json({
      message: "Pareamento realizado com sucesso!",
      psicologo: psicologoDisponivel.psicologo,
      sessao,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao realizar pareamento" });
  }
});

export default router;
