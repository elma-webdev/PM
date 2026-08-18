import { z } from "zod";

export const laudoSchema = z.object({
  paciente_id: z.uuid({ message: "paciente_id deve ser um UUID válido" }),
  psicologo_id: z.uuid({ message: "psicologo_id deve ser um UUID válido" }),
  objetivo: z.string().min(1, { message: "objetivo é obrigatório" }),
  resultado: z.string().min(1, { message: "resultado é obrigatório" }),
  discussao: z.string().min(1, { message: "discussão é obrigatória" }),
  conclusao: z.string().min(1, { message: "conclusão é obrigatória" }),
  historico: z.string().min(1, { message: "histórico é obrigatório" }),
  assinatura: z.string().optional(),
});
