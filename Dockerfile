# Usa a imagem mais recente do Node.js
FROM node:20-alpine

# Instala dependências necessárias para o PostgreSQL
RUN apk add --no-cache postgresql-client

# Cria um diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package*.json ./
RUN npm install

# Copia todo o código-fonte
COPY . .

# Expõe a porta 8080
EXPOSE 8080

# Script de inicialização que espera o PostgreSQL estar pronto
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Comando para iniciar o servidor
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "index.js"]
