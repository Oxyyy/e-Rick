const Discord = require('discord.js');

module.exports = {
	name: 'tronc',
	description: 'tronc technique',
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('C:/Users/petit/Desktop/e-Rick/images/tronc.png')
        message.channel.send(localFileAttachment)    
	},
};