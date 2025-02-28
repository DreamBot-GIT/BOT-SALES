const { Product } = require('../models/index.js');
const { createBuyButton } = require('../utils/buttons');
const { ActionRowBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'produtos',
    description: 'Lista todos os produtos disponíveis para venda',
    async execute(message) {
        try {
            const products = await Product.findAll();

            if (products.length === 0) {
                return message.reply('Não há produtos cadastrados no momento.');
            }

            for (const product of products) {
                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(product.name)
                    .setDescription(product.description)
                    .addFields(
                        { name: 'Preço', value: `R$ ${product.price}`, inline: true },
                        { name: 'Estoque', value: product.stock.toString(), inline: true }
                    )
                    .setTimestamp();

                const row = new ActionRowBuilder()
                    .addComponents(createBuyButton(product.id));

                await message.channel.send({ embeds: [embed], components: [row] });
            }

            logger.info(`Lista de produtos exibida para ${message.author.tag}`);
        } catch (error) {
            logger.error('Erro ao listar produtos:', error);
            await message.reply('Ocorreu um erro ao listar os produtos.');
        }
    },
};