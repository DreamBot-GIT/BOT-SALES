const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

const createBuyButton = (productId) => {
    return new ButtonBuilder()
        .setCustomId(`buy_${productId}`)
        .setLabel('Comprar')
        .setStyle('PRIMARY');
};

const createConfirmationButtons = () => {
    const confirm = new ButtonBuilder()
        .setCustomId('confirm_purchase')
        .setLabel('Confirmar Compra')
        .setStyle('SUCCESS');

    const cancel = new ButtonBuilder()
        .setCustomId('cancel_purchase')
        .setLabel('Desistir')
        .setStyle('DANGER');

    return new ActionRowBuilder().addComponents(confirm, cancel);
};

const createPaymentButtons = (pixKey) => {
    const showPix = new ButtonBuilder()
        .setCustomId('show_pix')
        .setLabel('Ver Chave PIX')
        .setStyle('PRIMARY');

    const confirmPayment = new ButtonBuilder()
        .setCustomId('confirm_payment')
        .setLabel('Confirmar Pagamento')
        .setStyle('SUCCESS');

    return new ActionRowBuilder().addComponents(showPix, confirmPayment);
};

module.exports = {
    createBuyButton,
    createConfirmationButtons,
    createPaymentButtons
};
