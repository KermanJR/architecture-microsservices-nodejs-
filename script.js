// Código para gerar produtos aleatórios para o teste de carga

const axios = require('axios');
const Chance = require('chance');
const chance = new Chance();

// Função para gerar um produto de aproximadamente 1 KB
const generateProduct = () => {
  const product = {
    name: chance.string({ length: 100 }), // Nome com 100 caracteres
    price: parseFloat(chance.floating({ min: 0, max: 1000, fixed: 2 })), // Preço
    description: chance.string({ length: 300 }), // Descrição com 300 caracteres
    productId: chance.guid(), // ID do Produto
    category: chance.string({ length: 100 }), // Categoria com 100 caracteres
    images: [
      chance.url({ length: 50 }) // URL da imagem 1 com 50 caracteres
    ], 
    stock: chance.integer({ min: 0, max: 100 }), // Estoque Disponível
    createdAt: chance.date({ year: 2022 }), // Data de Criação
    updatedAt: new Date(), // Data de Atualização
    ratings: chance.floating({ min: 0, max: 5, fixed: 1 }), // Média das avaliações
    comments: [
      chance.string({ length: 150 }), // Comentário 1 com 150 caracteres
      chance.string({ length: 150 })  // Comentário 2 com 150 caracteres
    ]
  };

  // Verifica o tamanho aproximado do objeto e ajusta se necessário
  let productString = JSON.stringify(product);
  while (productString.length < 1024) { // 1 KB = 1024 bytes
    product.description += ' ' + chance.string({ length: 10 }); // Adiciona mais texto para atingir 1 KB
    productString = JSON.stringify(product);
  }

  return product;
};


const postProduct = async (product, i) => {
  try {
    const response = await axios.post('http://localhost:3001/api/products', product);
    console.log(`${i} - Product posted: ${response.data.name}`);
  } catch (error) {
    console.error(`Error posting product: ${error.message}`);
  }
};

const postProducts = async (count) => {
  for (let i = 0; i < count; i++) {
    const product = generateProduct();
    await postProduct(product, i);
  }
};

// Postar 50.000 produtos
postProducts(20000).then(() => {
  console.log('All products have been posted');
});
