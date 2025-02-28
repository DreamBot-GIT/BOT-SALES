const { prefix } = require('../config');

module.exports = {
    name: 'help',
    description: 'Lista todos os comandos disponíveis',
    execute(message) {
        const commands = message.client.commands;
        const commandList = commands.map(cmd => {
            return `\`${prefix}${cmd.name}\`: ${cmd.description}`;
        }).join('\n');

        const helpEmbed = {
            color: 0x0099ff,
            title: 'Comandos Disponíveis',
            description: commandList,
            footer: {
                text: `Use ${prefix}help para ver esta mensagem novamente`
            },
            timestamp: new Date()
        };

        message.channel.send({ embeds: [helpEmbed] })
            .catch(error => console.error('Erro ao enviar mensagem de help:', error));
    },
};
