import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.ts";

const psicologosSeed = [
  {
    nome: "Beatriz",
    sobrenome: "Vaz",
    email: "beatriz.vaz@example.com",
    numero_ordem: "OPP00101",
    bio: "Especialista em terapia cognitivo-comportamental focada em ansiedade e stress laboral.",
    especialidade: "Psicologia Clínica",
    sexo: 0,
    nacionalidade: "Angolana",
    ano_experiencia: 8,
    nbi: "005812401LA041",
    grau_academico: "Mestrado em Psicologia Clínica",
    idiomas: "Português, Inglês",
    contacto: "924112201",
  },
  {
    nome: "Carlos",
    sobrenome: "Mbundu",
    email: "carlos.mbundu@example.com",
    numero_ordem: "OPP00102",
    bio: "Atendimento psicológico a adultos e casais, com foco em gestão emocional e conflitos familiares.",
    especialidade: "Terapia Familiar e de Casal",
    sexo: 1,
    nacionalidade: "Angolana",
    ano_experiencia: 12,
    nbi: "005812402LA042",
    grau_academico: "Doutoramento em Psicologia Social",
    idiomas: "Português, Francês",
    contacto: "924112202",
  },
  {
    nome: "Diana",
    sobrenome: "Chissano",
    email: "diana.chissano@example.com",
    numero_ordem: "OPP00103",
    bio: "Acompanhamento psicopedagógico e avaliação neuropsicológica de crianças e adolescentes.",
    especialidade: "Neuropsicologia",
    sexo: 0,
    nacionalidade: "Angolana",
    ano_experiencia: 6,
    nbi: "005812403BG043",
    grau_academico: "Pós-Graduação em Neuropsicologia",
    idiomas: "Português",
    contacto: "924112203",
  },
  {
    nome: "Eduardo",
    sobrenome: "Gomes",
    email: "eduardo.gomes@example.com",
    numero_ordem: "OPP00104",
    bio: "Psicólogo organizacional especializado em prevenção de burnout e desenvolvimento de carreira.",
    especialidade: "Psicologia Organizacional",
    sexo: 1,
    nacionalidade: "Angolana",
    ano_experiencia: 10,
    nbi: "005812404HO044",
    grau_academico: "Mestrado em Psicologia do Trabalho",
    idiomas: "Português, Inglês",
    contacto: "924112204",
  },
  {
    nome: "Fernanda",
    sobrenome: "Kibala",
    email: "fernanda.kibala@example.com",
    numero_ordem: "OPP00105",
    bio: "Abordagem humanista centrada na pessoa, apoio no luto e transições de vida.",
    especialidade: "Psicoterapia Humanista",
    sexo: 0,
    nacionalidade: "Angolana",
    ano_experiencia: 5,
    nbi: "005812405LA045",
    grau_academico: "Licenciatura em Psicologia",
    idiomas: "Português, Umbundo",
    contacto: "932112205",
  },
  {
    nome: "Goncalo",
    sobrenome: "Pinto",
    email: "goncalo.pinto@example.com",
    numero_ordem: "OPP00106",
    bio: "Tratamento de perturbações de humor, depressão e fobias específicas.",
    especialidade: "Psicologia Clínica",
    sexo: 1,
    nacionalidade: "Angolana",
    ano_experiencia: 9,
    nbi: "005812406CN046",
    grau_academico: "Mestrado em Psicopatologia",
    idiomas: "Português, Espanhol",
    contacto: "932112206",
  },
  {
    nome: "Helena",
    sobrenome: "Matos",
    email: "helena.matos@example.com",
    numero_ordem: "OPP00107",
    bio: "Intervenção psicológica na adolescência, autoestima e orientação vocacional.",
    especialidade: "Psicologia Educacional",
    sexo: 0,
    nacionalidade: "Angolana",
    ano_experiencia: 7,
    nbi: "005812407LA047",
    grau_academico: "Pós-Graduação em Orientação Vocacional",
    idiomas: "Português, Inglês",
    contacto: "932112207",
  },
  {
    nome: "Igor",
    sobrenome: "Tavares",
    email: "igor.tavares@example.com",
    numero_ordem: "OPP00108",
    bio: "Psicologia da saúde e acompanhamento emocional de pacientes com doenças crónicas.",
    especialidade: "Psicologia da Saúde",
    sexo: 1,
    nacionalidade: "Angolana",
    ano_experiencia: 11,
    nbi: "005812408HL048",
    grau_academico: "Mestrado em Psicologia da Saúde",
    idiomas: "Português",
    contacto: "943112208",
  },
  {
    nome: "Juliana",
    sobrenome: "Nzinga",
    email: "juliana.nzinga@example.com",
    numero_ordem: "OPP00109",
    bio: "Terapia sistémica e mediação de conflitos interpessoais.",
    especialidade: "Terapia Sistémica",
    sexo: 0,
    nacionalidade: "Angolana",
    ano_experiencia: 4,
    nbi: "005812409LA049",
    grau_academico: "Licenciatura em Psicologia Clínica",
    idiomas: "Português, Kimbundo",
    contacto: "943112209",
  },
  {
    nome: "Leonardo",
    sobrenome: "Dala",
    email: "leonardo.dala@example.com",
    numero_ordem: "OPP00110",
    bio: "Psicologia do desporto e alto rendimento, foco em concentração e controlo emocional.",
    especialidade: "Psicologia do Desporto",
    sexo: 1,
    nacionalidade: "Angolana",
    ano_experiencia: 6,
    nbi: "005812410UI040",
    grau_academico: "Pós-Graduação em Psicologia do Desporto",
    idiomas: "Português, Inglês",
    contacto: "913112210",
  },
];

async function main() {
  console.log("A iniciar o seed de 10 psicólogos...");

  const passwordHash = await bcrypt.hash("User123_", 10);

  for (const item of psicologosSeed) {
    await prisma.user.create({
        
      data: {

        nome: item.nome,
        sobrenome: item.sobrenome,
        email: item.email,
        password: passwordHash,
        role: 1, // Role de psicólogo conforme o seu Socket.IO
        psicologo: {
          create: {
            numero_ordem: item.numero_ordem,
            bio: item.bio,
            especialidade: item.especialidade,
            sexo: item.sexo,
            nacionalidade: item.nacionalidade,
            ano_experiencia: item.ano_experiencia,
            nbi: item.nbi,
            idiomas: item.idiomas,
            contacto: item.contacto,
          },
        },
      },
    });
  }

  console.log("Seed concluído: 10 psicólogos criados/verificados com sucesso!");
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed de psicólogos:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });