const Discord = require('discord.js');

module.exports = {
	name: 'friday',
    description: 'when it friday',
    cooldown: 10,
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('C:/Users/petit/Desktop/e-Rick/images/friday.mp4')
        message.channel.send(localFileAttachment)    
	},
};