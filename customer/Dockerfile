FROM node

WORKDIR /app/customer

# Copie os arquivos package.json e package-lock.json para o contêiner
COPY package*.json ./

# Instale todas as dependências
RUN npm install

# Copie o restante do código da aplicação para o contêiner
COPY . .

EXPOSE 8001

CMD ["npm", "start"]
