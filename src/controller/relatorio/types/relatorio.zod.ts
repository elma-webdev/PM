import { z } from "zod";

export const relatorioSchema = z.object({
  paciente_id: z
    .uuid({ message: "paciente_id deve ser um UUID válido" }),
  psicologo_id: z
    .uuid({ message: "psicologo_id deve ser um UUID válido" }),
  demanda: z.string().min(1, { message: "demanda é obrigatória" }),
  procedimentos: z
    .string()
    .min(1, { message: "procedimentos são obrigatórios" }),
  analises: z.string().min(1, { message: "analises são obrigatórias" }),
  conclusao: z.string().min(1, { message: "conclusão é obrigatória" }),
  assinatura: z.string().optional(),
  local_atendimento: z.enum(["online", "presencial"]).optional(),
});
