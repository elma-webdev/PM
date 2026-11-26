import { z } from "zod";

export const criarMensagemSchema = z
  .object({
    destinatario_id: z.string().uuid("ID do destinatário inválido."),
    conteudo: z.string().trim().min(1).optional().nullable(),
    file: z.url("URL do ficheiro inválida.").optional().nullable(),
  })
  .refine((data) => Boolean(data.conteudo || data.file), {
    message: "A mensagem deve conter texto ou um ficheiro.",
    path: ["conteudo"],
  });

export const listarMensagensParamsSchema = z.object({
  outro_user_id: z.uuid("ID do utilizador inválido."),
});