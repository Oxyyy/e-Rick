module.exports = {
    name: 'shutdown',
    description: 'kills the bot',
    execute(message, args) {
        if (message.author.id === '442449172990263329') {
            process.exit()
        }
        else message.channel.send('accès refusé!')


    },
};