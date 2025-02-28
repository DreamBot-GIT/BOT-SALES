const sequelize = require('./database');
const Product = require('./Product');
const Sale = require('./Sale');
const Cart = require('./Cart');

module.exports = {
    sequelize,
    Product,
    Sale,
    Cart
};