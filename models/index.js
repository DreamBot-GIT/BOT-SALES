const sequelize = require('./database');
const Product = require('./Product');
const Sale = require('./Sale');

module.exports = {
    sequelize,
    Product,
    Sale
};
