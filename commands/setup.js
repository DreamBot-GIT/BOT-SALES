const { Product } = require('../models/index.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'setup',
    description: 'Configura um novo produto para venda',
    async execute(message, args) {
        // Verifica permissões
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        try {
            const [name, price, stock, ...descriptionParts] = args;
            const description = descriptionParts.join(' ');

            if (!name || !price || !stock) {
                return message.reply('Uso correto: !setup <nome> <preço> <estoque> <descrição>');
            }

            const product = await Product.create({
                name,
                price: parseFloat(price),
                stock: parseInt(stock),
                description
            });

            await message.reply(`Produto "${name}" configurado com sucesso!`);
            logger.info(`Novo produto configurado: ${name}`);
        } catch (error) {
            logger.error('Erro ao configurar produto:', error);
            await message.reply('Ocorreu um erro ao configurar o produto.');
        }
    },
};