const Discord = require('discord.js');

module.exports = {
	name: 'sunday',
    description: 'when it sunday',
    cooldown: 10,
	execute(message) {
        const localFileAttachment = new Discord.MessageAttachment('./images/sunday.mp4')
        message.channel.send(localFileAttachment)    
	},
};