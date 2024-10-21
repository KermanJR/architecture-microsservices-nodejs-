const Product = require("../models/product");
const redisClient = require("../config/redis");
const uuid = require('uuid');


class ProductController {
  constructor() {
    this.createOrder = this.createOrder.bind(this);
    this.getOrderStatus = this.getOrderStatus.bind(this);
    this.ordersMap = new Map();
  }

  async createProduct(req, res, next) {
    try {
      const product = new Product(req.body);

      const validationError = product.validateSync();
      if (validationError) {
        return res.status(400).json({ message: validationError.message });
      }

      await product.save({ timeout: 30000 });

      redisClient.del("products");

      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }

  async createOrder(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const { ids } = req.body;
      const products = await Product.find({ _id: { $in: ids } });
  
      const orderId = uuid.v4(); 
      this.ordersMap.set(orderId, { 
        status: "pending", 
        products, 
        username: req.user.username
      });
  
      
      let order = this.ordersMap.get(orderId);
      while (order.status !== 'completed') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        order = this.ordersMap.get(orderId);
      }
  
     
      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
  

  async getOrderStatus(req, res, next) {
    const { orderId } = req.params;
    const order = this.ordersMap.get(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json(order);
  }


// Função assíncrona para obter produtos
async getProducts(req, res) {

  // Tenta recuperar os produtos do cache Redis usando a chave "products"
  const cachedProducts = await redisClient.get("products");

  // Se os produtos estiverem no cache, retorna-os como resposta em JSON
  if (cachedProducts) {
    console.log("Produtos recuperados do cache");
    return res.json(JSON.parse(cachedProducts));
  }

  // Caso não estejam no cache, busca os produtos do banco de dados
  const products = await Product.find();

  // Armazena os produtos no cache Redis e define uma expiração de 1 hora
  await redisClient.set("products", JSON.stringify(products), { EX: 3600 });

  // Retorna os produtos do banco de dados como resposta
  console.log("Produtos recuperados do banco de dados");
  res.json(products);
}




  // Método para apagar todos os produtos
  async deleteAllProducts(req, res, next) {
    try {
      // Apaga todos os produtos da coleção
      await Product.deleteMany({});
      
      // Limpa o cache de produtos no Redis
      await redisClient.del("products");

      res.status(200).json({ message: "Todos os produtos foram apagados com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao apagar produtos." });
    }
  }
}

module.exports = ProductController;
