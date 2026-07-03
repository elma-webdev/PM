import { prisma } from "../../../lib/prisma";

const ParearPacienteComPsicologo = async (req: any, res: any): Promise<any> => {
  const { id } = req.user;

  try {
    const psicologoDisponivel = await prisma.agenda_psicologo.findMany({
      where: {
        isLogged: 1,
        status_disponibilidade: 1,
      },
      include: { psicologo: true },
    });

    for (let psicologo of psicologoDisponivel) {
      const atendimentosHoje = await prisma.sessao.count({
        where: {
          psicologo_id: psicologo.psicologo_id,
          inicio: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      });

      if (atendimentosHoje >= psicologo.limiteAtendimento) {
        throw new Error(
          `O psicólogo  atingiu o limite de atendimentos para hoje, portanto não tem disponibilidade.`,
        );
      }

      const sessao = await prisma.sessao.create({
        data: {
          paciente_id: id,
          psicologo_id: psicologo.psicologo_id,
          status: 1,
        },
      });

      await prisma.agenda_psicologo.update({
        where: { psicologo_id: psicologo.psicologo_id },
        data: { status_disponibilidade: 0 },
      });
      return sessao;
    }

    return null;
  } catch (error: any) {
    console.error("Erro ao realizar pareamento");
    throw new Error(error.message);
  }
};

export default ParearPacienteComPsicologo;
