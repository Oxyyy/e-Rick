const db = require('quick.db');

module.exports = {
	name: 'setRecentMap',
	aliases: [ 'rsedit' ],
	args: true,
	admin: true,

	execute(message, args, fb) {
		if (args.length !== 1) return message.reply('argument invalide!');
		let recentMap = parseFloat(args[0]);

		fb.collection('guilds').doc(message.guild.id).update({
			recentMap: recentMap
		});
		message.channel.send(`\`Most recent map set to: ${recentMap}\``);
	}
};
