import { prisma } from "../lib/prisma.js";
import { createHash } from "crypto";
async function Seed() {
  console.log("AQUI");

  // await prisma.privilegio.createMany({
  //   data: [
  //     {
  //       nome: "Limite de 10 pacientes",
  //       descricao: "Atender até 10 pacientes ativos",
  //     },
  //     {
  //       nome: "Agendamento simples",
  //       descricao: "Agendamento sem integração externa",
  //     },
  //     {
  //       nome: "Perfil activo na plataforma",
  //       descricao: "Perfil visível pelos pacientes",
  //     },
  //     { nome: "Chat em tempo real", descricao: "Enviar e receber mensagens" },
  //     {
  //       nome: "Dashboard ",
  //       descricao:
  //         "Ver resumo de sessões agendadas, atendidas e pacientes activos",
  //     },
  //     {
  //       nome: "Limite de 30 pacientes",
  //       descricao: "Atender até 30 pacientes",
  //     },
  //     {
  //       nome: "Sessão instantânea",
  //       descricao: "Realização de sessões virtuais instantâneas",
  //     },
  //     {
  //       nome: "Publicação de posts",
  //       descricao: "Fazer publicação em sua rede",
  //     },
  //     {
  //       nome: "Agendamento com integração",
  //       descricao: "Agendar sessões com o Google Calendar",
  //     },
  //     {
  //       nome: "Dashboard avançados",
  //       descricao:
  //         "Ver resumo de sessões agendadas, atendidas, pacientes activos e faturamentos",
  //     },
  //     {
  //       nome: "Sem limite de pacientes",
  //       descricao: "Atender quantos pacientes quiser",
  //     },
  //     {
  //       nome: "Suporte prioritário",
  //       descricao: "Atendimento rápido pelo suporte",
  //     },
  //     {
  //       nome: "Maior visibilidade",
  //       descricao: "Ter destaque nas pesquisas de psicólogos",
  //     },
  //     {
  //       nome: "Integração completa com Google Calendar",
  //       descricao: "Gerenciar agendamento a partir do Google Calendar",
  //     },
  //   ],
  // });

  const user = await prisma.user.create({
    data: {
      role: 1,
      nome: "Admin",
      sobrenome: "Admin",
      email: "admin@example.com",
      photo: null,
      password: "admin",
    },
  });

  console.log(user);
}

Seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
