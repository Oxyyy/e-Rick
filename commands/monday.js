const Discord = require('discord.js');

module.exports = {
	name: 'monday',
    description: 'when it monday',
    cooldown: 10,
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('C:/Users/petit/Desktop/e-Rick/images/monday.mp4')
        message.channel.send(localFileAttachment)    
	},
};