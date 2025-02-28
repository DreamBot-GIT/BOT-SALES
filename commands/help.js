const { prefix } = require('../config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: '❓ Lista todos os comandos disponíveis',
    execute(message) {
        const commands = message.client.commands;
        const commandList = commands.map(cmd => {
            return `${cmd.description}\n\`${prefix}${cmd.name}\`\n`;
        }).join('\n');

        const helpEmbed = new EmbedBuilder()
            .setColor(0x000080) // Azul escuro
            .setTitle('📚 Sistema de Vendas - Comandos')
            .setDescription(
                '**🛍️ Comandos de Venda**\n\n' +
                `\`${prefix}produtos\`\n➜ Mostra todos os produtos disponíveis\n\n` +
                `\`${prefix}setup <nome> <preço> <estoque> <descrição>\`\n➜ Configura um novo produto\n\n` +
                `\`${prefix}setpix <nome_produto> <chave_pix>\`\n➜ Define a chave PIX de um produto\n\n` +
                '**⚙️ Comandos de Configuração**\n\n' +
                `\`${prefix}config cargo <produto> @cargo\`\n➜ Define cargo para compradores\n\n` +
                `\`${prefix}config feedback <produto> #canal\`\n➜ Define canal de feedback\n\n` +
                '**🛒 Sistema de Carrinho**\n\n' +
                '• Adicione produtos ao carrinho\n' +
                '• Visualize seus itens\n' +
                '• Faça compras múltiplas\n\n' +
                '**📋 Lista de Todos os Comandos**\n' +
                commandList
            )
            .setFooter({
                text: `💡 Use ${prefix}help ou /help para ver esta mensagem novamente`
            })
            .setTimestamp();

        message.channel.send({ embeds: [helpEmbed] })
            .catch(error => console.error('Erro ao enviar mensagem de help:', error));
    },
};