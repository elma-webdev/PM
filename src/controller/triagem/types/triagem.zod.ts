import {z} from 'zod';

export const triagemSchema=z.object({

        tristeza:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        ansiedade:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        irritabilidade:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        automutilacao:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        sono:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        apetite:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        isolamento:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        criseAtual:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional(),
        pensamentosSuicidas:z.enum(["sim","nao"],{message:"A resposta deve ser 'sim' ou 'nao'"}).optional()
    })

