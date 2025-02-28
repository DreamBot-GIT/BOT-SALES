const { Product } = require('../models/index.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'config',
    description: 'Configura canal de feedback e cargo para produtos',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        const [subCommand, productName, ...params] = args;

        if (!subCommand || !productName) {
            return message.reply('Uso correto:\n!config cargo <produto> <@cargo>\n!config feedback <produto> <#canal>');
        }

        try {
            const product = await Product.findOne({ where: { name: productName } });

            if (!product) {
                return message.reply('Produto não encontrado.');
            }

            if (subCommand === 'cargo') {
                const role = message.mentions.roles.first();
                if (!role) {
                    return message.reply('Por favor, mencione um cargo válido.');
                }

                await product.update({ roleId: role.id });
                await message.reply(`Cargo ${role} configurado para o produto "${productName}"`);
                logger.info(`Cargo configurado para o produto: ${productName}`);
            }
            else if (subCommand === 'feedback') {
                const channel = message.mentions.channels.first();
                if (!channel) {
                    return message.reply('Por favor, mencione um canal válido.');
                }

                await product.update({ feedbackChannelId: channel.id });
                await message.reply(`Canal de feedback ${channel} configurado para o produto "${productName}"`);
                logger.info(`Canal de feedback configurado para o produto: ${productName}`);
            }
            else {
                await message.reply('Subcomando inválido. Use "cargo" ou "feedback".');
            }
        } catch (error) {
            logger.error('Erro ao configurar produto:', error);
            await message.reply('Ocorreu um erro ao configurar o produto.');
        }
    },
};
