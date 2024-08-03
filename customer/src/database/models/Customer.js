const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Customer = sequelize.define('Customer', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    wishlist: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    },
    cart: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    },
    orders: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    }
  });
module.exports = Customer;
