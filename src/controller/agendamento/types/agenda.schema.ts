import { z } from 'zod';
import { EstadoPagamento } from '../../../../generated/prisma/enums.ts';


export const criarAgendamentoSchema = z.object({
  modo_sessao: z.number().int().optional().default(0),
  psicologo_id: z.uuid("ID do psicólogo inválido.").optional().nullable(),
  paciente_id: z.uuid("ID do psicólogo inválido.").optional().nullable(),
  dataInicio: z
    .string()
    .transform((val) => new Date(val)),
  duracaoMinutos: z.number().int().positive().default(45),
  observacao: z.string().optional().nullable(),
  valor: z.string(),
});


export const criarPagamentoSchema = z.object({

  agendamento_id: z.uuid('O agendamento_id deve ser um UUID válido.'),
  valor: z.string('O valor do campo deves tar preenchido'),
  estado: z.enum(EstadoPagamento).default(EstadoPagamento.PENDENTE),
  metodoPagamento: z.string().min(1).optional().nullable(),
  referencia: z.string().min(1).optional().nullable(),
  dataPagamento: z.coerce.date(),
});

export const atualizarPagamentoSchema = criarPagamentoSchema
  .omit({ agendamento_id: true })
  .partial();