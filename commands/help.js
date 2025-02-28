const { prefix } = require('../config');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: '❓ Lista todos os comandos disponíveis',
    execute(message) {
        const commands = message.client.commands;
        const commandList = commands.map(cmd => {
            return `\`${prefix}${cmd.name}\` - ${cmd.description}`;
        }).join('\n');

        const helpEmbed = new EmbedBuilder()
            .setColor(0x000080) // Azul escuro
            .setTitle('📚 Comandos Disponíveis')
            .setDescription(
                '**Exemplos de uso:**\n' +
                `\`${prefix}produtos\` - Mostra todos os produtos disponíveis\n` +
                `\`${prefix}setup nome 100 10 Descrição do produto\` - Configura um novo produto\n` +
                `\`${prefix}setpix nome_produto chave_pix\` - Define a chave PIX\n` +
                `\`${prefix}config cargo produto @cargo\` - Define cargo para produto\n\n` +
                '**Lista de Comandos:**\n' + commandList
            )
            .setFooter({
                text: `Use ${prefix}help ou /help para ver esta mensagem novamente`
            })
            .setTimestamp();

        message.channel.send({ embeds: [helpEmbed] })
            .catch(error => console.error('Erro ao enviar mensagem de help:', error));
    },
};