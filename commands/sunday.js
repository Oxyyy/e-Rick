const Discord = require('discord.js');

module.exports = {
	name: 'sunday',
    description: 'when it sunday',
    cooldown: 10,
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('C:/Users/petit/Desktop/e-Rick/images/sunday.mp4')
        message.channel.send(localFileAttachment)    
	},
};