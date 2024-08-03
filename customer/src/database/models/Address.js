const { DataTypes } = require('sequelize');
const { sequelize, connectDB } = require('../connection');

const Address = sequelize.define('Address', {
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
module.exports = Address;
