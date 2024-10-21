// Importa o módulo do Redis para criar um cliente Redis.
const redis = require("redis");

/*Carrega variáveis de ambiente de um arquivo .env para o processo, 
útil para configurar URLs, senhas, etc*/
require("dotenv").config();

/*Cria um cliente Redis, especificando a URL do servidor Redis 
que está sendo executado na porta 6379.
*/
const client = redis.createClient({
  url: 'redis://redis:6379'
});

/*Define um evento para tratar erros que possam ocorrer na conexão 
com o Redis, exibindo a mensagem de erro no console.*/
client.on("error", (err) => {
  console.error("Redis error:", err);
});

/* Define um evento que será disparado quando a conexão com o Redis 
for bem-sucedida, exibindo uma mensagem de confirmação.*/
client.on("connect", () => {
  console.log("Connected to Redis");
});

/* Conecta ao servidor Redis de forma assíncrona e captura 
qualquer erro que possa ocorrer durante a conexão.*/
client.connect().catch(console.error);

module.exports = client;
// Exporta o cliente Redis para ser utilizado em outras partes da aplicação.






