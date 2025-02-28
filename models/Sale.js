const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Sale = sequelize.define('Sale', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    threadId: {
        type: DataTypes.STRING
    }
});

module.exports = Sale;
