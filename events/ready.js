const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        logger.info(`Bot logged in as ${client.user.tag}`);
        client.user.setActivity('!help para comandos', { type: 'PLAYING' });
    },
};
