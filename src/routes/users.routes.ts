import {createPaciente, createAnonimo,getPacientes, getAnonimo} from "../controller/users/users";
import { Router} from "express";


const userRouter=Router();
// #swagger.tags = ['Pacientes']
// #swagger.description = 'Cria um novo paciente com dados pessoais e relacionamento com usuário (userId)'
// #swagger.parameters['body'] = {
//   in: 'body',
//   required: true,
//   schema: {
//     nome: 'Maria Silva',          // string obrigatória
//     email: 'maria@email.com',     // string obrigatória
//     telefone: 929998877,          // number obrigatória
//     userId: 1,                    // number obrigatória (chave estrangeira de User)
//     password: 'senhaSegura123',   // string obrigatória
//     idade: 25,                    // number obrigatória
//     photo: 'https://example.com/foto.png' // string opcional
//   }
// }
// #swagger.responses[201] = {
//   description: 'Paciente criado com sucesso',
//   schema: {
//     nome: 'Maria Silva',
//     email: 'maria@email.com',
//     telefone: 929998877,
//     userId: 1,
//     idade: 25,
//     photo: 'https://example.com/foto.png'
//   }
// }
// #swagger.responses[400] = {
//   description: 'Dados inválidos ou campos obrigatórios ausentes'
// }
userRouter.post('/create-paciente', createPaciente);

// #swagger.tags = ['Pacientes']
// #swagger.description = 'Retorna a lista de pacientes cadastrados, omitindo dados sensíveis como senha'
// #swagger.responses[200] = {
//   description: 'Lista de pacientes',
//   schema: [
//     {
//       nome: 'Maria Silva',
//       email: 'maria@email.com',
//       telefone: 929998877,
//       idade: 30,
//       userId: 1,
//       photo: 'https://example.com/foto.png'
//     }
//   ]
// }
// #swagger.responses[500] = {
//   description: 'Erro interno ao buscar pacientes'
// }
userRouter.get('/get-paciente', getPacientes);


userRouter.get('/get-paciente', getPacientes);
userRouter.post('/user', createAnonimo);
userRouter.get('/get', getAnonimo);


export {userRouter};