import { faker } from "@faker-js/faker";

  
  export const generatePatientData = () => ({
    telefone:faker.string.numeric(9),
    idade: faker.number.int({ min: 18, max: 90 }),
    user: {
      email: faker.internet.email().toLowerCase(),
      password: "PasswordValida123_",
      role: 0,
      nome: faker.person.firstName(),
      sobrenome: faker.person.lastName()
    }
  });

