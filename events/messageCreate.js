const { prefix } = require('../config');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        try {
            const command = client.commands.get(commandName);
            if (!command) return;

            command.execute(message, args);
            logger.info(`Command ${commandName} executed by ${message.author.tag}`);
        } catch (error) {
            logger.error(`Error executing command ${commandName}:`, error);
            message.reply('Houve um erro ao executar este comando!').catch(console.error);
        }
    },
};
