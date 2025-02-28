const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

const createProductButtons = (productId) => {
    const buy = new ButtonBuilder()
        .setCustomId(`buy_${productId}`)
        .setLabel('Comprar')
        .setEmoji('💳')
        .setStyle('PRIMARY');

    const addToCart = new ButtonBuilder()
        .setCustomId(`cart_add_${productId}`)
        .setLabel('Adicionar ao Carrinho')
        .setEmoji('🛒')
        .setStyle('SECONDARY');

    const viewCart = new ButtonBuilder()
        .setCustomId('cart_view')
        .setLabel('Ver Carrinho')
        .setEmoji('👀')
        .setStyle('SECONDARY');

    return new ActionRowBuilder().addComponents(buy, addToCart, viewCart);
};

const createCartActionButtons = () => {
    const buyCart = new ButtonBuilder()
        .setCustomId('cart_buy')
        .setLabel('Comprar Carrinho')
        .setEmoji('💰')
        .setStyle('SUCCESS');

    const clearCart = new ButtonBuilder()
        .setCustomId('cart_clear')
        .setLabel('Limpar Carrinho')
        .setEmoji('🗑️')
        .setStyle('DANGER');

    const closeCart = new ButtonBuilder()
        .setCustomId('cart_close')
        .setLabel('Fechar')
        .setEmoji('❌')
        .setStyle('SECONDARY');

    return new ActionRowBuilder().addComponents(buyCart, clearCart, closeCart);
};

const createConfirmationButtons = () => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm_purchase')
        .setLabel('Confirmar Compra')
        .setEmoji('✅')
        .setStyle('SUCCESS');

    const cancel = new ButtonBuilder()
        .setCustomId('cancel_purchase')
        .setLabel('Desistir')
        .setEmoji('❌')
        .setStyle('DANGER');

    return new ActionRowBuilder().addComponents(confirm, cancel);
};

const createPaymentButtons = () => {
    const showPix = new ButtonBuilder()
        .setCustomId('show_pix')
        .setLabel('Ver Chave PIX')
        .setEmoji('💸')
        .setStyle('PRIMARY');

    const confirmPayment = new ButtonBuilder()
        .setCustomId('confirm_payment')
        .setLabel('Confirmar Pagamento')
        .setEmoji('✅')
        .setStyle('SUCCESS');

    return new ActionRowBuilder().addComponents(showPix, confirmPayment);
};

module.exports = {
    createProductButtons,
    createCartActionButtons,
    createConfirmationButtons,
    createPaymentButtons
};