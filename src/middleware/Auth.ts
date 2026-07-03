import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const authConfig =
  (process.env.SCT as string) || "this1secret2is3not4what5you6think";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send({ error: "No token provider" });
    return;
  }
  const parts: string[] = authHeader.split(" ");

  if (parts.length !== 2) {
    res.status(401).send({ error: "Token error!" });
    return;
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    res.status(401).send({ error: "Token malFormatted" });
    return;
  }

  jwt.verify(token, authConfig, (error, decoded) => {
    if (error) {
      res.status(401).send({ error: "Token invalid" });
      return;
    }

    const payload = decoded as { id: number, role: number};

    req.user = payload;

    next();
  });
};
