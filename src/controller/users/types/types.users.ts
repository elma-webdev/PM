import {z} from "zod";

export const userSchema = z.object({
  photo: z.string().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  sobrenome: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.email("Endereço de email inválido").min(1, "Email é obrigatório"),
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
  role: z.number(),
});

export const patientSchema = z.object({
    idade: z.number().int().positive("Idade deve ser um número inteiro positivo").optional(),
    telefone: z.string().regex(/^\d{8}9$/, "Número de telefone inválido").optional(),
    user: userSchema
});
export const psychologistSchema = z.object({
    numero_ordem: z.string().min(1, "Número de ordem é obrigatório"),
    bio: z.string().optional(),
    especialidade: z.string().optional(),
    user: userSchema
});