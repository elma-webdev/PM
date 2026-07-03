import { Router } from "express"; 
import { createPost, getPosts, getPostsByUser, updateLikePost } from "../controller/post/post.js";
import { validateParams } from "../middleware/types/validateParams.js";
import { getIDParamsSchema } from "../middleware/types/validate-params.zod.js";

export const postRouter=Router();

postRouter.post("/posts", createPost);
postRouter.get("/posts", getPosts);
postRouter.get("/posts/:id", getPostsByUser);
postRouter.patch("/posts/:id", validateParams(getIDParamsSchema), updateLikePost);