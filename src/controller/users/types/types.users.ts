import { z } from "zod";

export const userSchema = z.object({
  photo: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  email: z
    .email("Endereço de email inválido")
    .min(1, "Email é obrigatório")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .min(
      8,
      "A senha deve conter no mínimo 8 carateres, incluindo letras maiusculas, minúsculas, números e caracteres especiais.",
    )
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-+])[A-Za-z\d@$!%*?&_#\-+]{8,}$/,
      "A senha deve conter no mínimo 8 carateres, incluindo letras maiusculas, minúsculas, números e caracteres especiais.",
    )
    .nonempty("A senha é obrigatória"),
});

export const patientSchema = z.object({
  idade: z.coerce
    .number()
    .min(18, "Idade deve ser um número válido e maior ou igual a 18")
    .positive("Idade deve ser um número inteiro positivo")
    .optional(),
  telefone: z
    .string()
    .regex(/^\d{9}$/, "Número de telefone inválido")
    .optional(),
  user: userSchema,
});
export const psychologistSchema = z.object({
  numero_ordem: z.string().min(1, "Número de ordem é obrigatório"),
  bio: z.string().optional(),
  especialidade: z.string().optional(),
  sexo: z.number().int().optional(),
  nacionalidade: z.string().optional(),
  universidade: z.string().optional(),
  ano_conclusao: z.number().int().optional(),
  ano_experiencia: z.number().int().optional(),
  nbi: z.string().optional(),
  grau_academico: z.string().optional(),
  idiomas: z.string().optional(),
  contacto: z.string().optional(),
  user: userSchema,
});
