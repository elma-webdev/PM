import { z } from 'zod';
import { EstadoAgendamento, EstadoPagamento } from '../../../../generated/prisma/enums.ts';

export const criarAgendamentoSchema = z.object({
  pref_genero:z.int().optional(),
  modo_sessao: z.number().int().optional().default(0),
  psicologo_id: z.uuid("ID do psicólogo inválido.").optional().nullable(),
  dataInicio: z.iso
    .datetime({
      offset: true,
      message: "Data de início inválida. Use o formato ISO 8601 (ex: 2026-11-24T09:00:00+01:00).",
    })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Data inválida.",
    })
    .refine((date) => date.getTime() > Date.now(), {
      message: "A data não pode estar no passado.",
    }),
  duracaoMinutos: z.number().int().positive().default(45),
});

export const criarPagamentoSchema = z.object({
  agendamento_id: z.uuid('O agendamento_id deve ser um UUID válido.'),
  valor: z.string('O valor do campo deves tar preenchido'),
  estado: z.enum(EstadoPagamento).default(EstadoPagamento.PENDENTE),
  metodoPagamento: z.string().min(1).optional().nullable(),
  referencia: z.string().min(1).optional().nullable(),
  dataPagamento: z.date(),
});

const apenasLetrasRegex = /^[\p{L}\s]+$/u;

export const estado_schema=z.enum(EstadoAgendamento)

export const nome_schema=z
    .string()
    .trim()
    .min(1, "Nome é obrigatório")
    .regex(apenasLetrasRegex, "O nome deve conter apenas letras.")

export const psicologo_id_schema=z.uuid("ID do psicólogo inválido.")
 

export const atualizarPagamentoSchema = criarPagamentoSchema
  .omit({ agendamento_id: true })
  .partial();

export const idParamSchema = z.uuid("Este campo apenas aceita uuid.")

export const observacaoSchema=z.object({
  observacao:z.string("Este campo nao pode estar vazio").max(50)
})