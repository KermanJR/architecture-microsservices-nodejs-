FROM node

WORKDIR /app/customer

# Copia apenas os arquivos package.json e package-lock.json primeiro
COPY package*.json ./

# Instala as dependências, incluindo o bcrypt
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Exponha a porta do serviço
EXPOSE 8001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
