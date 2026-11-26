import { z } from "zod";
import { EstadoSessao } from "../../../../generated/prisma/enums.ts";


export const sessao_schema =z.object({
  agendamento_id:z.uuid('O campo agendamento_id é obrigatório.'), 
  status:z.enum(EstadoSessao).default("AGENDADA"), 
})


    // const meetingPayload = {
    //   id: meeting.id,
    //   join_url: meeting.join_url,
    //   password: meeting.password,
    //   start_url: meeting.start_url,
    //   created_at: meeting.created_at,
    //   agenda: meeting.agenda,
    //   host_id: meeting.host_id,
    //   host_email: meeting.host_email,
    //   type: meeting.type,
    //   status: meeting.status,
    //   topic: meeting.topic,
    //   duration: meeting.duration,
    // };