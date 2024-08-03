const { Sequelize } = require('sequelize');
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST } = process.env;
require('dotenv').config();


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
});

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = { sequelize, connectDB };
