const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    description: {
        type: DataTypes.TEXT
    },
    pixKey: {
        type: DataTypes.STRING
    },
    roleId: {
        type: DataTypes.STRING
    },
    feedbackChannelId: {
        type: DataTypes.STRING
    }
});

module.exports = Product;
