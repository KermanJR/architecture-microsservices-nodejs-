const Customer = require('./Customer');
const Address = require('./address');

Customer.hasMany(Address);
Address.belongsTo(Customer);

module.exports = {
  Customer,
  Address
};
