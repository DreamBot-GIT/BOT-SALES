const { Product, Sale } = require('../models/index.js');
const { createConfirmationButtons, createPaymentButtons } = require('../utils/buttons');
const logger = require('../utils/logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isButton()) return;

        try {
            if (interaction.customId.startsWith('buy_')) {
                const productId = interaction.customId.split('_')[1];
                const product = await Product.findByPk(productId);

                if (!product) {
                    return interaction.reply({ content: 'Produto não encontrado.', ephemeral: true });
                }

                // Criar thread para a compra
                const thread = await interaction.channel.threads.create({
                    name: `compra-${interaction.user.username}-${product.name}`,
                    autoArchiveDuration: 60,
                    reason: `Thread de compra para ${product.name}`
                });

                // Criar venda pendente
                const sale = await Sale.create({
                    userId: interaction.user.id,
                    productId: product.id,
                    quantity: 1,
                    totalPrice: product.price,
                    threadId: thread.id
                });

                await thread.send({
                    content: `Olá ${interaction.user}! Você está comprando: ${product.name}\nPreço: R$ ${product.price}\n\nPor favor, confirme sua compra:`,
                    components: [createConfirmationButtons()]
                });

                await interaction.reply({ content: `Sua compra foi iniciada em ${thread}`, ephemeral: true });
                logger.info(`Nova thread de compra criada para ${interaction.user.tag}`);
            }

            // Outros handlers de interação serão implementados aqui

        } catch (error) {
            logger.error('Erro ao processar interação:', error);
            await interaction.reply({ 
                content: 'Ocorreu um erro ao processar sua solicitação.', 
                ephemeral: true 
            });
        }
    }
};