import redis from "redis";
import dotenv from 'dotenv';
dotenv.config();
const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.connect()
.then(() => console.log("✅ Conectado ao Redis"))
.catch((err: unknown)=>{
    console.log("❌ Erro ao conectar ao Redis", err);
    process.exit(1);
})

export default client;