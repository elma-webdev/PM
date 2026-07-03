import {z} from 'zod';

export const userLoginSchema=z.object({
    email:z.email("Endereço de email inválido"),
    password:z.string().nonempty("A senha é obrigatória"),

})