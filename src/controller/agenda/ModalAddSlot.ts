async function podeAdicionarPaciente(psicologoId: string) {
  const subscricao = await prisma.subscricao.findFirst({
    where: { psicologo_id: psicologoId, status: 1 },
    include: { plano: { include: { plano_privilegios: { include: { privilegio: true } } } } },
  });

  const privilegios = subscricao?.plano.plano_privilegios.map(p => p.privilegio.nome);

  if (privilegios?.includes("Atender até 10 pacientes")) {
    const count = await prisma.pacientePsicologo.count({ where: { psicologo_id: psicologoId } });
    if (count >= 10) {
      throw new Error("Seu plano não permite mais pacientes.");
    }
  }
}

async function podeEmitirRelatorio(psicologoId: string) {
  const subscricao = await prisma.subscricao.findFirst({
    where: { psicologo_id: psicologoId, status: 1 },
    include: {
      plano: {
        include: { plano_privilegios: { include: { privilegio: true } } },
      },
    },
  });

  const privilegios = subscricao?.plano.plano_privilegios.map(
    (p) => p.privilegio.nome,
  );

  if (!privilegios?.includes("Emitir relatórios")) {
    throw new Error("Seu plano não permite emitir relatórios.");
  }
}

import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma"; // ajusta para o teu path

// Middleware genérico
export function checkPrivilegio(privilegioNecessario: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const psicologoId = req.user.id; // assumindo que já tens o user no req via JWT

      // Buscar subscrição ativa do psicólogo
      const subscricao = await prisma.subscricao.findFirst({
        where: { psicologo_id: psicologoId, fim: null },
        include: {
          plano: {
            include: {
              plano_privilegios: {
                include: { privilegio: true },
              },
            },
          },
        },
      });

      if (!subscricao) {
        return res
          .status(403)
          .json({ error: "Nenhum plano ativo encontrado." });
      }

      // Extrair lista de privilégios
      const privilegios = subscricao.plano.plano_privilegios.map(
        (pp) => pp.privilegio.nome,
      );

      // Validar privilégio
      if (!privilegios.includes(privilegioNecessario)) {
        return res.status(403).json({
          error: `Recurso não disponível neste plano. É necessário privilégio: ${privilegioNecessario}`,
        });
      }

      next(); // autorizado
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro interno de autorização." });
    }
  };
}


// rota que exige Zoom
app.post("/sessao/zoom", checkPrivilegio("Reuniões via Zoom"), (req, res) => {
  res.json({ msg: "Sessão Zoom criada com sucesso!" });
});

// rota que exige notificações automáticas
app.post(
  "/notificacao",
  checkPrivilegio("Notificações automáticas"),
  (req, res) => {
    res.json({ msg: "Notificação enviada!" });
  },
);

// rota que exige integração com calendário
app.post(
  "/calendar",
  checkPrivilegio("Integração completa com calendário"),
  (req, res) => {
    res.json({ msg: "Evento sincronizado com Google Calendar!" });
  },
);



// Previlegios
// Basico
// - Agendamento simples (sem integração externa)
// - Limite de pacientes (ex.: até 10 vinculos)
// - Sessões presenciais ou online
// - Perfil ativo na plataforma
// - Chat em tempo real

// Intermediario
// - Tudo do Básico
// - Sessao instantanea
// - Publicacao de posts
// - Integração com Google Calendar
// - Dashboard básicos (sessões, faturamento simples)
// - Limite maior de pacientes (ex.: até 30)

// Avancado
// - Tudo do Intermediário
// - Sessões ilimitadas
// - Dashboard avançados (estatísticas detalhadas, engajamento)
// - Suporte prioritário
// - Maior visibilidade (perfil em destaque)
// - Ferramentas premium de comunicação (videochamadas integradas, notificações automáticas por email, SMS ou push.)
// - Integração completa com calendário -  o psicólogo cria um slot de disponibilidade → o evento aparece no Google Calendar dele.
// Se o paciente agenda uma sessão → o evento também aparece no calendário, com link do Zoom.