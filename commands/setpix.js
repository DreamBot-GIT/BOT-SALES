const { Product } = require('../models/index.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'setpix',
    description: 'Define a chave PIX para um produto',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        const [productName, ...pixKeyParts] = args;
        const pixKey = pixKeyParts.join(' ');

        if (!productName || !pixKey) {
            return message.reply('Uso correto: !setpix <nome_produto> <chave_pix>');
        }

        try {
            const product = await Product.findOne({ where: { name: productName } });

            if (!product) {
                return message.reply('Produto não encontrado.');
            }

            await product.update({ pixKey });
            await message.reply(`Chave PIX configurada com sucesso para o produto "${productName}"`);
            logger.info(`Chave PIX atualizada para o produto: ${productName}`);
        } catch (error) {
            logger.error('Erro ao configurar PIX:', error);
            await message.reply('Ocorreu um erro ao configurar a chave PIX.');
        }
    },
};