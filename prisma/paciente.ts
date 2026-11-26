 // Ajuste para "../generated/prisma/client" se usar output customizado
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";


const pacientesSeed = [
  { nome: "Ana", sobrenome: "Mendes", email: "ana.mendes@example.com", idade: 28, telefone: "923451001", nbi: "004512301LA041" },
  { nome: "Bruno", sobrenome: "Kiala", email: "bruno.kiala@example.com", idade: 34, telefone: "923451002", nbi: "004512302LA042" },
  { nome: "Carla", sobrenome: "Domingos", email: "carla.domingos@example.com", idade: 25, telefone: "923451003", nbi: "004512303BG043" },
  { nome: "Daniel", sobrenome: "Ferreira", email: "daniel.ferreira@example.com", idade: 41, telefone: "923451004", nbi: "004512304HO044" },
  { nome: "Edna", sobrenome: "Tavares", email: "edna.tavares@example.com", idade: 30, telefone: "923451005", nbi: "004512305LA045" },
  { nome: "Fabio", sobrenome: "Manuel", email: "fabio.manuel@example.com", idade: 22, telefone: "931451006", nbi: "004512306CN046" },
  { nome: "Gisele", sobrenome: "Nunes", email: "gisele.nunes@example.com", idade: 37, telefone: "931451007", nbi: "004512307LA047" },
  { nome: "Helder", sobrenome: "Baptista", email: "helder.baptista@example.com", idade: 29, telefone: "931451008", nbi: "004512308CS048" },
  { nome: "Ines", sobrenome: "Lopes", email: "ines.lopes@example.com", idade: 33, telefone: "931451009", nbi: "004512309LA049" },
  { nome: "Joao", sobrenome: "Mateus", email: "joao.mateus@example.com", idade: 45, telefone: "931451010", nbi: "004512310BI040" },
  { nome: "Katia", sobrenome: "Silva", email: "katia.silva@example.com", idade: 27, telefone: "942451011", nbi: "004512311LA041" },
  { nome: "Lucas", sobrenome: "Antunes", email: "lucas.antunes@example.com", idade: 31, telefone: "942451012", nbi: "004512312HL042" },
  { nome: "Mariana", sobrenome: "Costa", email: "mariana.costa@example.com", idade: 24, telefone: "942451013", nbi: "004512313LA043" },
  { nome: "Nelson", sobrenome: "Pedro", email: "nelson.pedro@example.com", idade: 39, telefone: "942451014", nbi: "004512314UI044" },
  { nome: "Olivia", sobrenome: "Santos", email: "olivia.santos@example.com", idade: 26, telefone: "942451015", nbi: "004512315LA045" },
  { nome: "Paulo", sobrenome: "Neto", email: "paulo.neto@example.com", idade: 35, telefone: "912451016", nbi: "004512316MA046" },
  { nome: "Queila", sobrenome: "Almeida", email: "queila.almeida@example.com", idade: 29, telefone: "912451017", nbi: "004512317LA047" },
  { nome: "Rafael", sobrenome: "Sousa", email: "rafael.sousa@example.com", idade: 42, telefone: "912451018", nbi: "004512318CA048" },
  { nome: "Sara", sobrenome: "Viegas", email: "sara.viegas@example.com", idade: 21, telefone: "912451019", nbi: "004512319LA049" },
  { nome: "Tiago", sobrenome: "Cardoso", email: "tiago.cardoso@example.com", idade: 36, telefone: "912451020", nbi: "004512320NA040" },
];

async function main() {
  console.log("A iniciar o seed de 20 pacientes...");

  const passwordHash = await bcrypt.hash("User123_", 10);

  for (const item of pacientesSeed) {
   
    await prisma.user.upsert({
      where: { email: item.email },
      update: {},
      create: {
        nome: item.nome,
        sobrenome: item.sobrenome,
        email: item.email,
        password: passwordHash,
        role: 0, 
        paciente: {
          create: {
            idade: item.idade,
            telefone: item.telefone,
            nbi: item.nbi,
          },
        },
      },
    });
  }

  console.log("Seed concluído: 20 pacientes criados/verificados com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });