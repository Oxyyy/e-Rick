const Discord = require('discord.js');

module.exports = {
	name: 'tronc',
	description: 'tronc technique',
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('./images/tronc.png')
        message.channel.send(localFileAttachment)    
	},
};