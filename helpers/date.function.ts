import { EstadoAgendamento } from "../generated/prisma/enums.ts";
import { prisma } from "../lib/prisma.ts";

export function calcularDataFim(dataInicio: Date, duracaoMinutos: number): Date {
  return new Date(dataInicio.getTime() + duracaoMinutos * 60 * 1000);
}

/**
 * Verifica se o intervalo [dataInicio, dataFim] respeita o horário de funcionamento
 * no fuso horário local (Angola - UTC+1).
 */
export function validarHorarioAtendimento(
  dataInicio: Date,
  dataFim: Date
): { valido: boolean; mensagem?: string } {
  // Ajusta para o fuso horário de Angola (UTC+1) para ler dia da semana e horas locais
  const offsetAngolaMs = 1 * 60 * 60 * 1000;
  const inicioLocal = new Date(dataInicio.getTime() + offsetAngolaMs);
  const fimLocal = new Date(dataFim.getTime() + offsetAngolaMs);

  // Garante que a consulta não começa num dia e termina no outro
  if (inicioLocal.getUTCDate() !== fimLocal.getUTCDate()) {
    return {
      valido: false,
      mensagem: "A consulta deve começar e terminar no mesmo dia.",
    };
  }

  // getUTCDay() retorna: 0 = Domingo, 1 = Segunda, 2 = Terça, ..., 6 = Sábado
  const diaSemana = inicioLocal.getUTCDay();

  // Converte a hora local em minutos desde a meia-noite (ex: 08:30 = 510 min)
  const minutosInicio =
    inicioLocal.getUTCHours() * 60 + inicioLocal.getUTCMinutes();
  const minutosFim =
    fimLocal.getUTCHours() * 60 + fimLocal.getUTCMinutes();

  // Domingo (0) e Segunda (1): Encerrado (baseado na sua tabela Terça a Sexta)
  if (diaSemana === 0 || diaSemana === 1) {
    return {
      valido: false,
      mensagem: "Não há atendimento aos domingos e segundas-feiras.",
    };
  }

  // Terça (2) a Sexta (5): 08h00 (480 min) às 17h00 (1020 min)
  if (diaSemana >= 2 && diaSemana <= 5) {
    if (minutosInicio < 8 * 60 || minutosFim > 17 * 60) {
      return {
        valido: false,
        mensagem:
          "De terça a sexta-feira, o atendimento ocorre apenas entre 08h00 e 17h00.",
      };
    }
  }

  // Sábado (6): 08h00 (480 min) às 12h00 (720 min)
  if (diaSemana === 6) {
    if (minutosInicio < 8 * 60 || minutosFim > 12 * 60) {
      return {
        valido: false,
        mensagem: "Aos sábados, o atendimento ocorre apenas entre 08h00 e 12h00.",
      };
    }
  }

  return { valido: true };
}


export const temConflitoHorario = async (
  psicologoId: string,
  dataInicio: Date,
  dataFim: Date
): Promise<boolean> => {
  const conflito = await prisma.agendamento.findFirst({
    where: {
      psicologo_id: psicologoId,
      AND: [
        { dataInicio: { lt: dataFim } },
        { dataFim: { gt: dataInicio } },
      ],
      OR: [
        { estado: EstadoAgendamento.CONFIRMADO },
        {
          estado: EstadoAgendamento.PENDENTE_PAGAMENTO,
          expiracaoReserva: { gt: new Date() },
        },
      ],
    },
  });

  return Boolean(conflito);
};