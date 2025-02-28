const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Cart = sequelize.define('Cart', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    items: {
        type: DataTypes.JSON,
        defaultValue: [],
        get() {
            const items = this.getDataValue('items');
            return items ? JSON.parse(items) : [];
        },
        set(value) {
            this.setDataValue('items', JSON.stringify(value));
        }
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

module.exports = Cart;
