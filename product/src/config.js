require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost:3001/api/products",
  redisURI: "redis://redis",
  exchangeName: "products",
  queueName: "products_queue",
};
