module.exports = {
    name: 'ping',
    description: 'Mostra a latência do bot',
    execute(message) {
        message.channel.send('Calculando ping...')
            .then(sent => {
                const latency = sent.createdTimestamp - message.createdTimestamp;
                sent.edit(`Pong! Latência: ${latency}ms. API Latência: ${message.client.ws.ping}ms`);
            })
            .catch(error => console.error('Erro ao enviar mensagem de ping:', error));
    },
};
