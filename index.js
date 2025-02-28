const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config');
const logger = require('./utils/logger');
const express = require('express');
const cron = require('node-cron');
const { exec } = require('child_process');

// Configuração do servidor Express
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('Bot está online!');
});

// Criar nova instância do cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Coleção para armazenar comandos
client.commands = new Collection();

// Carregar comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Carregar eventos
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Configura o backup automático para rodar a cada 6 horas
cron.schedule('0 */6 * * *', () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    exec('git add . && git commit -m "Backup automático ' + timestamp + '" && git push', 
        (error, stdout, stderr) => {
            if (error) {
                logger.error(`Erro no backup: ${error}`);
                return;
            }
            logger.info(`Backup realizado com sucesso: ${stdout}`);
        });
});

// Tratamento de erros global
process.on('unhandledRejection', error => {
    logger.error('Unhandled promise rejection:', error);
});

// Iniciar o servidor e o bot
app.listen(port, '0.0.0.0', () => {
    logger.info(`Servidor rodando na porta ${port}`);
});

// Login do bot
client.login(token).catch(error => {
    logger.error('Erro ao fazer login:', error);
    process.exit(1);
});