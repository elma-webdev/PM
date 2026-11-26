export const includeUsuariosMensagem = {
  remetente: {
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      photo: true,
      email: true,
    },
  },
  destinatario: {
    select: {
      id: true,
      nome: true,
      sobrenome: true,
      photo: true,
      email: true,
    },
  },
};