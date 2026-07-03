import {z} from 'zod'

export const getIDParamsSchema=z.strictObject({
    id:z.uuid("O ID deve ser um número válido")
})