import {z} from "zod"

export const postSchema=z.object({
    content:z.string().max(255,"O conteúdo do post deve conter no máximo 255 caracteres"),
    hastags:z.string().optional(),
    likes:z.number().default(0),
    photoUrl:z.string().optional(),
    psicologo_id:z.uuid("O id do psicologo é obrigatorio"),
})