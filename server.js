const express = require('express');
const cron = require('node-cron');
const { exec } = require('child_process');
const app = express();
const port = 5000;

// Rota básica para manter o servidor online
app.get('/', (req, res) => {
    res.send('Bot está online!');
});

// Configura o backup automático para rodar a cada 6 horas
cron.schedule('0 */6 * * *', () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    exec('git add . && git commit -m "Backup automático ' + timestamp + '" && git push', 
        (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro no backup: ${error}`);
                return;
            }
            console.log(`Backup realizado com sucesso: ${stdout}`);
        });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});
