const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { token } = require('./config');
const logger = require('./utils/logger');
const express = require('express');
const cron = require('node-cron');
const { exec } = require('child_process');
const sequelize = require('./models/database');

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
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
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

// Configura o backup automático
const githubToken = process.env.GITHUB_TOKEN;
const githubUsername = 'DreamBot-GIT';
const repoName = 'BOT-SALES';

// Função para executar o backup
const executeBackup = () => {
    if (!githubToken) {
        logger.error('Token do GitHub não configurado. Configure GITHUB_TOKEN no arquivo .env');
        return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    // Configura as credenciais do Git temporariamente
    const gitCommands = [
        'git config --global user.email "dreambot.git@gmail.com"',
        'git config --global user.name "DreamBot-GIT"',
        `git remote -v || git remote add origin https://${githubUsername}:${githubToken}@github.com/${githubUsername}/${repoName}.git`,
        'git add .',
        `git commit -m "Backup automático ${timestamp}" || echo "Nada para commitar"`,
        'git push origin HEAD || git push --set-upstream origin main'
    ].join(' && ');

    logger.info('Iniciando backup para o GitHub...');
    exec(gitCommands, (error, stdout, stderr) => {
        if (error) {
            logger.error(`Erro no backup: ${error}`);
            if (stderr) logger.error(`Detalhes do erro: ${stderr}`);
            return;
        }
        logger.info(`Backup realizado com sucesso`);
        logger.debug(`Saída do comando Git: ${stdout}`);
    });
};

// Agenda o backup para rodar a cada 12 horas (menos frequente para evitar problemas)
cron.schedule('0 */12 * * *', executeBackup);

// Executa um backup inicial após 1 minuto (para dar tempo ao sistema iniciar completamente)
setTimeout(executeBackup, 60000);

// Sincroniza os modelos com o banco de dados
sequelize.sync().then(() => {
    logger.info('Banco de dados sincronizado');
}).catch(error => {
    logger.error('Erro ao sincronizar banco de dados:', error);
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