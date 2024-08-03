const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "API Gateway",
            version: '1.0.0',
            description: "API Gateway for Microservices"
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Gateway Server"
            },
            {
                url: "http://localhost:8001",
                description: "Customer Server"
            }
        ]
    },
    apis: ["./customer.js"] // Certifique-se de que este caminho está correto e o arquivo contém a documentação do Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.use("/customer", proxy("http://localhost:8001"));
app.use("/shopping", proxy("http://localhost:8003"));
app.use("/", proxy("http://localhost:8002")); 



app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
  console.log("API Docs are available at http://localhost:8000/api-docs");
});
