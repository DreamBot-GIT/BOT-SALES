
const logger = require('../utils/logger');
const { exec } = require('child_process');

module.exports = {
    name: 'backup',
    description: 'Realiza backup manual do código para o GitHub',
    async execute(message, args) {
        // Verificar permissões
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('Você não tem permissão para usar este comando.');
        }

        const githubToken = process.env.GITHUB_TOKEN;
        const githubUsername = 'DreamBot-GIT';
        const repoName = 'BOT-SALES';

        if (!githubToken) {
            return message.reply('Token do GitHub não configurado. Configure GITHUB_TOKEN no arquivo .env');
        }

        message.channel.send('⏳ Iniciando backup para o GitHub...');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        const gitCommands = [
            'git config --global user.email "dreambot.git@gmail.com"',
            'git config --global user.name "DreamBot-GIT"',
            `git remote -v || git remote add origin https://${githubUsername}:${githubToken}@github.com/${githubUsername}/${repoName}.git`,
            'git add .',
            `git commit -m "Backup manual ${timestamp}" || echo "Nada para commitar"`,
            'git push origin HEAD || git push --set-upstream origin main'
        ].join(' && ');

        exec(gitCommands, (error, stdout, stderr) => {
            if (error) {
                logger.error(`Erro no backup manual: ${error}`);
                if (stderr) logger.error(`Detalhes do erro: ${stderr}`);
                message.channel.send('❌ Erro ao realizar o backup. Verifique os logs para mais detalhes.');
                return;
            }
            logger.info(`Backup manual realizado com sucesso`);
            message.channel.send('✅ Backup realizado com sucesso!');
        });
    },
};
