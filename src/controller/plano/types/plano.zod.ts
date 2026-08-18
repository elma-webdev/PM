import { z } from "zod";

export const planoSchema = z.object({
  duracao: z.number().int().positive({ message: "Duração deve ser um número positivo" }),
  valor: z.number().positive({ message: "Valor deve ser um número positivo" }),
  nivel: z.number().int().positive({ message: "Nível deve ser um número positivo" }),
});