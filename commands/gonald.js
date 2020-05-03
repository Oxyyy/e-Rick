const Discord = require ('discord.js')
const { MessageEmbed } = require('discord.js');
const { black } = require('../colours.json');

module.exports = {
    name: 'gonald',
    description: 'You will always be remembered, RIP',
    aliases: ['rip', 'f', 'gon'],

    execute (message) {   
        message.channel.send('https://cdn.discordapp.com/attachments/612312867139616769/706111697391321158/gonald.mp4\nhttps://cdn.discordapp.com/attachments/651923068171583519/706113725479911504/gon.mp4\nRIP GONALD :cry:')  
    }
}