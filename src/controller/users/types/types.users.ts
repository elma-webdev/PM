import { z } from "zod";
import { pt } from "zod/locales";


const biAngolanoRegex = /^\d{9}[A-Z]{2}\d{3}$/;
const apenasLetrasRegex = /^[\p{L}\s]+$/u;

export const userSchema = z.object({
  photo: z.string().optional(),
 nome: z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .regex(apenasLetrasRegex, "O nome deve conter apenas letras."),
  sobrenome: z
    .string()
    .trim()
    .min(1, "Sobrenome é obrigatório")
    .regex(apenasLetrasRegex, "O sobrenome deve conter apenas letras."),
  email: z
    .email("Endereço de email inválido")
    .min(1, "Email é obrigatório")
    .min(1, "Email é obrigatório"),
  password: z
    .string()
    .trim()
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
    .trim()
    .regex(/^\d{9}$/, "Número de telefone inválido")
    .optional(),
    nbi: z.string("Numero de bi obrigatorio").regex(biAngolanoRegex, "Número de BI inválido. Use o formato angolano (ex: 000000000LA000).").trim(),
  user: userSchema,
});
export const psychologistSchema = z.object({
  numero_ordem: z.string().min(1, "Número de ordem é obrigatório"),
  bio: z.string().optional(),
  especialidade: z.string().optional(),
  sexo: z.number().int().optional(),
  nacionalidade: z.string().optional(),
  ano_experiencia: z.number().int().optional(),
  nbi: z.string("Numero de bi obrigatorio").regex(biAngolanoRegex, "Número de BI inválido. Use o formato angolano (ex: 000000000LA000).").trim(),
  grau_academico: z.string().optional(),
  idiomas: z.string().optional(),
  contacto: z.string().trim().optional(),
  user: userSchema,
});
