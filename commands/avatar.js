module.exports = {
	name: 'avatar',
	description: 'answers with the corresponding user\'s avatar',
    cooldown: 30,
    aliases: ['pfp', 'icon'],
	execute(message, args) {
		if (!message.mentions.users.size) {
            return message.channel.send(`Votre avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        }
    
        const avatarList = message.mentions.users.map(user => {
            return `Avatar de ${user.username}': <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
    
        // send the entire array of strings as a message
        // by default, discord.js will `.join()` the array with `\n`
        message.channel.send(avatarList);
	},
};