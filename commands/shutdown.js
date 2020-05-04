module.exports = {
    name: 'shutdown',
    description: 'kills the bot',
    admin: true,
    execute(message, args) {
            process.exit()
    },
};