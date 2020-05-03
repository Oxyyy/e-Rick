const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'helps the user',
    aliases: ['h'],
    execute(message, args) {
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            let msg1 = ('**Liste des commandes:**');
            data.push(commands.map(command => command.name).join(' | '));
            let msg3 = (`\nVous pouvez aussi utiliser \`${prefix}help [commande]\` pour obtenir les détails d'une commande!`);

            return message.channel.send(`${msg1}\n\`${data}\`\n${msg3}`)
        }
        else {
            const name = args[0].toLowerCase();
            const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

            if (!command) {
                return message.reply('commande inexistante!');
            }

            data.push(`**Nom:** ${command.name}`);

            if (command.aliases) data.push(`**Alias:** ${command.aliases.join(', ')}`);
            if (command.description) data.push(`**Description:** ${command.description}`);
            if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

            data.push(`**Cooldown:** ${command.cooldown || 3} seconde(s)`);

            message.channel.send(data, { split: true });
        }
    }
}