import { z } from "zod";

export const subscricaoSchema = z.object({
  fim: z.date().optional(),
  inicio: z.date().optional(),
  referencia: z.string().optional(),
  plano_id: z.uuid({ message: "plano_id deve ser um UUID válido" }),
  psicologo_id: z
    .uuid({ message: "psicologo_id deve ser um UUID válido" }),
  status: z.number().int({ message: "status deve ser um número inteiro" }),
});
