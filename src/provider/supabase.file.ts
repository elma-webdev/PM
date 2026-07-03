import  dotenv  from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadToSupabase = async (
  file: Express.Multer.File,
): Promise<string> => {

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = fileName;

  const { error } = await supabase.storage
    .from("profile")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) {
    console.error("Erro Supabase:", error.message);
    throw new Error("Falha no upload para o Supabase");
  }

  const { data: photo } = supabase.storage
    .from("profile")
    .getPublicUrl(filePath);

  return photo.publicUrl;
};
