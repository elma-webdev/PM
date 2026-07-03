import { prisma } from "../lib/prisma.js";

async function Seed() {
    console.log("AQUI")
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
