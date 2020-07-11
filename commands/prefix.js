module.exports = {
    name: 'prefix',
    args: true,
    admin: true,

    async execute(message, args, fb) {
        if (args.length !== 1) return message.reply('argument invalide!')
        let nPrefix = args[0]

        fb.collection('guilds').doc(message.guild.id).update({
            'prefix' : nPrefix
        }).then(() => {
            message.channel.send(`\`Prefix set to: ${nPrefix}\``)
        })
    }
}