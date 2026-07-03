import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';

// Definir explicitamente o tipo do retorno como RequestHandler resolve o conflito
export const validateParams = (schema: ZodSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.params);
      next(); 
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Apenas envie a resposta, sem dar "return" que exporte o tipo Response
        res.status(400).json({
          message: 'Erro de validação nos parâmetros',
          errors: error,
        });
        return;
      }
      next(error);
    }
  };
};
