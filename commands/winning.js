const Discord = require('discord.js')
module.exports = {
    name: 'winning',
    description: 'are ya winning son?',
    cooldown: 10,
    aliases: ['son'],
        execute(message, args) {
            const localfileAttachment = new Discord.MessageAttachment('C:/Users/petit/Desktop/e-Rick/images/winningson.png')
            message.channel.send(localfileAttachment)


        }

}