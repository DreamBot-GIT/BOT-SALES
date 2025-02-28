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
                    autoArchiveDuration: 480, // 8 horas
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
            else if (interaction.customId === 'confirm_purchase') {
                const thread = interaction.channel;
                const sale = await Sale.findOne({ where: { threadId: thread.id } });
                const product = await Product.findByPk(sale.productId);

                await interaction.reply('Quantos produtos você deseja comprar? (Digite o número)');

                const filter = m => !isNaN(m.content) && m.author.id === interaction.user.id;
                const collector = thread.createMessageCollector({ filter, time: 60000, max: 1 });

                collector.on('collect', async (m) => {
                    const quantity = parseInt(m.content);
                    logger.info(`Usuário ${interaction.user.tag} solicitou ${quantity} unidades do produto ${product.name}`);

                    if (quantity <= 0) {
                        logger.warn(`Quantidade inválida (${quantity}) solicitada por ${interaction.user.tag}`);
                        return thread.send('Quantidade inválida.');
                    }
                    if (quantity > product.stock) {
                        logger.warn(`Estoque insuficiente (${product.stock}) para pedido de ${quantity} unidades por ${interaction.user.tag}`);
                        return thread.send(`Desculpe, só temos ${product.stock} unidades em estoque.`);
                    }

                    await sale.update({
                        quantity,
                        totalPrice: product.price * quantity
                    });

                    await thread.send({
                        content: `Total a pagar: R$ ${product.price * quantity}`,
                        components: [createPaymentButtons()]
                    });
                });
            }
            else if (interaction.customId === 'cancel_purchase') {
                const thread = interaction.channel;
                const sale = await Sale.findOne({ where: { threadId: thread.id } });

                await sale.update({ status: 'cancelled' });
                await thread.send('Compra cancelada.');
                logger.info(`Compra cancelada por ${interaction.user.tag}`);
                setTimeout(() => thread.delete(), 5000);
            }
            else if (interaction.customId === 'show_pix') {
                const sale = await Sale.findOne({ where: { threadId: interaction.channel.id } });
                const product = await Product.findByPk(sale.productId);

                await interaction.reply({
                    content: `Chave PIX: ${product.pixKey}\nValor: R$ ${sale.totalPrice}\n\nPor favor, envie o comprovante de pagamento.`,
                    ephemeral: true
                });
                logger.info(`Chave PIX exibida para ${interaction.user.tag}`);
            }
            else if (interaction.customId === 'confirm_payment') {
                const thread = interaction.channel;
                const sale = await Sale.findOne({ where: { threadId: thread.id } });
                const product = await Product.findByPk(sale.productId);

                // Atualizar status da venda
                await sale.update({ status: 'paid' });
                logger.info(`Pagamento confirmado para venda #${sale.id}`);

                // Atualizar estoque
                await product.update({ stock: product.stock - sale.quantity });
                logger.info(`Estoque atualizado para produto ${product.name}: ${product.stock} unidades restantes`);

                // Adicionar cargo ao comprador
                if (product.roleId) {
                    try {
                        const guild = interaction.guild;
                        const member = await guild.members.fetch(sale.userId);
                        await member.roles.add(product.roleId);
                        logger.info(`Cargo adicionado para ${member.user.tag}`);
                    } catch (error) {
                        logger.error(`Erro ao adicionar cargo: ${error}`);
                        await thread.send('Não foi possível adicionar o cargo automaticamente. Por favor, contate um administrador.');
                    }
                }

                if (product.feedbackChannelId) {
                    try {
                        const feedbackChannel = await interaction.guild.channels.fetch(product.feedbackChannelId);
                        await feedbackChannel.send(
                            `Nova compra realizada!\nComprador: ${interaction.user}\nProduto: ${product.name}\nQuantidade: ${sale.quantity}\nValor Total: R$ ${sale.totalPrice}`
                        );
                    } catch (error) {
                        logger.error(`Erro ao enviar feedback: ${error}`);
                    }
                }

                await thread.send('Pagamento confirmado! Obrigado pela compra.');

                // Auto-arquivar thread após 8 horas
                setTimeout(() => thread.setArchived(true), 28800000);
            }

        } catch (error) {
            logger.error('Erro ao processar interação:', error);
            await interaction.reply({ 
                content: 'Ocorreu um erro ao processar sua solicitação.', 
                ephemeral: true 
            });
        }
    }
};