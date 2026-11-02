import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.ts"; // Ou app.js, dependendo de onde o Express está configurado

describe("Testes das rotas de criacao dos pacientes", () => {
  it.skip("deve retornar erro ou resposta válida para a rota /api/paciente", async () => {
    const response = await request(app).post("/paciente").send({
  "telefone": "940019234",
  "idade":25,
  "user": {
      "email": "anaww@example.com",
      "password": "AnaLima123_",
      "role": 0,
      "nome": "Ana Silva",
      "sobrenome": "Lima"
  }
});
    console.log("Resposta da rota /paciente:", response.body);
    // Como a rota pode exigir autenticação ou retornar validações, valide os status esperados
    expect(response.status).toBe(404);
  });
   it("deve retornar erro ou resposta válida para a rota /api/login", async () => {
     const response = await request(app)
       .post("/login")
       .send({
           email: "anaww@example.com",
           password: "AnaLima123_",
         });
     console.log("Resposta da rota /paciente:", response.body);
     // Como a rota pode exigir autenticação ou retornar validações, valide os status esperados
     expect(response.status).toBe(404);
   });
});
