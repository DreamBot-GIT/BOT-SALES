const { Product } = require('../models/index.js');
const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'produtos',
    description: '🛍️ Lista todos os produtos disponíveis para venda',
    async execute(message) {
        try {
            const products = await Product.findAll();

            if (products.length === 0) {
                const reply = await message.reply('Não há produtos cadastrados no momento.');
                setTimeout(() => reply.delete(), 8000);
                setTimeout(() => message.delete(), 8000);
                return;
            }

            // Criar menu de seleção
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('select_product')
                .setPlaceholder('Escolha um produto para exibir')
                .addOptions(products.map(product => ({
                    label: product.name,
                    description: `R$ ${product.price} - Estoque: ${product.stock}`,
                    value: product.id.toString(),
                    emoji: '🏷️'
                })));

            // Criar botão de confirmação
            const confirmButton = new ButtonBuilder()
                .setCustomId('confirm_product')
                .setLabel('Confirmar Seleção')
                .setStyle('Primary')
                .setEmoji('✅');

            const rows = [
                new ActionRowBuilder().addComponents(selectMenu),
                new ActionRowBuilder().addComponents(confirmButton)
            ];

            const selectorEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('🛍️ Selecione um Produto')
                .setDescription('Escolha o produto que deseja exibir neste canal')
                .setFooter({ text: 'Esta mensagem será apagada em 8 segundos' });

            const selectorMessage = await message.channel.send({
                embeds: [selectorEmbed],
                components: rows
            });

            // Auto-delete após 8 segundos
            setTimeout(() => {
                message.delete().catch(() => {});
                selectorMessage.delete().catch(() => {});
            }, 8000);

            logger.info(`Menu de seleção de produtos exibido para ${message.author.tag}`);
        } catch (error) {
            logger.error('Erro ao listar produtos:', error);
            const errorMsg = await message.reply('Ocorreu um erro ao listar os produtos.');
            setTimeout(() => {
                message.delete().catch(() => {});
                errorMsg.delete().catch(() => {});
            }, 8000);
        }
    },
};