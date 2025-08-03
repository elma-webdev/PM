// swagger.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Psicólogos & Pacientes",
    description: "Documentação automática com Swagger Autogen",
  },
  host: "localhost:3000/api",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/global.routes.ts"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
