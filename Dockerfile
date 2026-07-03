# Escolhe a versão do Node compatível
FROM node:22
# Define diretório de trabalho
WORKDIR /app
# Copia arquivos de dependência
COPY package*.json ./
ENV NODE_ENV=development
# Instala dependências
RUN npm install
# Copia os binarios do Prisma
COPY prisma ./prisma
# Gera os binários do Prisma
RUN npx prisma generate
# Porta exposta
EXPOSE 4000
# Comando de inicialização
CMD ["npm", "run", "dev"]
