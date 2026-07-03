// import { ApiError } from "../../error-handler/api-error.t";
import { prisma } from "../../../lib/prisma.js";
import { Request, Response } from "express";
import { postSchema } from "./types/types.zod.js";
import { ApiError } from "../../error-handler/api-error.js";

export async function createPost(
  req: Request,
  res: Response,
): Promise<any> {
  const { content, hastags, likes, photoUrl, psicologo_id } = req.body;

  postSchema.parse(req.body)

  try {
    const novoPost = await prisma.post.create({
      data: {
        content, hastags, likes, photoUrl, psicologo_id,
      },
      omit:{
        updatedAt: true
      },
    });

    return res.status(201).json(novoPost);
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }
}

export async function getPosts(
  req: Request,
  res: Response,
): Promise<any> {
  

  try{
    const posts = await prisma.post.findMany({});
    return res.status(200).json(posts);

  }catch(err: unknown) {
    if (err instanceof ApiError) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }


}
export async function getPostsByUser(
  req: Request,
  res: Response,
): Promise<any> {
  
  try{

    const {id} = req.params
    const posts = await prisma.post.findMany({
     where:{
       psicologo_id: id
     }
    });
    return res.status(200).json(posts);

  }catch(err: unknown) {
    if (err instanceof ApiError) {
      console.error("ERRO NO GET PSICOLOGOS:", err);
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }


}
export async function updateLikePost(
  req: Request,
  res: Response,
): Promise<any> {
  
  try{

    const {id} = req.params
    const posts=await prisma.post.update({
      where:{post_id: id},
      data:{likes: {increment: 1}}
    });
    console.log(id)
    return res.status(200).json({ message: "Curtida adicionada com sucesso." });

  }catch(err: unknown) {
    if (err instanceof ApiError) {
      return res.status(500).json({ message: err.message });
    }
    console.error(err);
    return res.status(500).json({ message: "Erro desconhecido." });
  }


}