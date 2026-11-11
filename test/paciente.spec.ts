import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "../src/app.ts"; // Ou app.js, dependendo de onde o Express está configurado
import { generatePatientData } from "../helpers/paciente.fake.ts";

describe("Testes das rotas de criacao dos pacientes", () => {

  const novoPaciente=generatePatientData()

  let letToken:string

  it("deve retornar status 201 para a rota /api/paciente", async () => {
    
    const response = await request(app).post("/api/paciente").send(novoPaciente);
    
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe(novoPaciente.user.email);
  });


   it("deve retornar status 200 resposta válida para a rota /api/login", async () => {

     const response = await request(app)
       .post("/api/login")
       .send({
           email: novoPaciente.user.email,      
        password: novoPaciente.user.password 
         });

     letToken=response.body.token

     expect(response.status).toBe(200);
     expect(response.body).toHaveProperty("token");
     expect(response.body.user.email).toBe(novoPaciente.user.email);
   });

   it('deve retornar erro 409 para a rota /api/paciente quando o email do usuário já existir no sistema', async () => {

    const response = await request(app).post("/api/paciente").send(novoPaciente);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Usuário ja cadastrado no sistema.');
  });

    it("deve retornar um status erro 401 para lista de pacientes sem token", async () => {

    const response = await request(app)
      .get("/api/paciente") 
      .send();

    console.log("Resposta da rota GET /api/paciente:", response.body);

    // 2. Validações do comportamento da API
    expect(response.status).toBe(401);
  });

    it("deve retornar uma lista de pacientes com status 200 porque tem token", async () => {

    const response = await request(app)
      .get("/api/paciente") 
      .set("Authorization", `Bearer ${letToken}`) 
      .send();

    console.log("Resposta da rota GET /api/paciente:", response.body);

    // 2. Validações do comportamento da API
    expect(response.status).toBe(200);
    
    // Garante que o retorno é um Array (findMany do Prisma)
    expect(Array.isArray(response.body)).toBe(true); 
    
    // Garante que a lista não está vazia (já que criámos um paciente no primeiro teste)
    expect(response.body.length).toBeGreaterThan(0);

    // 3. Valida se a estrutura de dados bate exatamente com o select do seu controller
    const primeiroPacienteDaLista = response.body[0];
    expect(primeiroPacienteDaLista).toHaveProperty("idade");
    expect(primeiroPacienteDaLista).toHaveProperty("telefone");
    expect(primeiroPacienteDaLista).toHaveProperty("createdAt");
    expect(primeiroPacienteDaLista).toHaveProperty("user");
    
    // Valida as propriedades internas do objeto user selecionado no Prisma
    expect(primeiroPacienteDaLista.user).toHaveProperty("id");
    expect(primeiroPacienteDaLista.user).toHaveProperty("nome");
    expect(primeiroPacienteDaLista.user).toHaveProperty("sobrenome");
    expect(primeiroPacienteDaLista.user).toHaveProperty("email");
    expect(primeiroPacienteDaLista.user).toHaveProperty("photo");

  });

});

describe.skip ("Teste de rotas de listar pacientes", () => {
  

})
