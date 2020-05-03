const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, masterID } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();



client.once('ready', () => {
    console.log("Connected as " + client.user.tag);
    var generalChannel = client.channels.cache.get("705039359354732645") // Replace with known channel ID
    generalChannel.send("Connected " + "(" + date + " " + time + ")")
    client.user.setActivity("Le Sanctuaire", { type: "WATCHING" })
});

client.on('guildMemberUpdate', (oldMember, newMember) => {
	// If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
    const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
    const logChannel = client.channels.cache.get('705481214735286282');

	if (removedRoles.size > 0) logChannel.send(`The roles ${removedRoles.map(r => r.name)} were removed from ${oldMember.displayName}.`);
	// If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.size > 0) logChannel.send(`The roles ${addedRoles.map(r => r.name)} were added to ${oldMember.displayName}.`);
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    console.log(message.content)
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') { // check si la commande est exécutée en DM
        return message.reply('Cette commande ne peut pas être exécutée en DMs!');
    }

    if (command.args && !args.length) { // check les arguments | donne l'usage standard
        let reply = `Il manque des arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nUsage standard: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    if (message.author.id === masterID) {
        try {
            command.execute(message, args); // execute le fichier js correspondant à la commande
            return;
    
        } catch (error) {
            console.error(error);
            message.reply('Une erreur a empêché la commande de s\'effectuer correctement!')
            return;
        }
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`vous devez attendre ${timeLeft.toFixed(1)} secondes avant d'effectuer la commande \`${command.name}\``);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
        command.execute(message, args); // execute le fichier js correspondant à la commande

    } catch (error) {
        console.error(error);
        message.reply('Une erreur a empêché la commande de s\'effectuer correctement!');
    }
}
);

client.on('message', message => {
    if (message.author == client.user) {
        return
    }
    if (message.content.includes(client.user.id)) {
        message.channel.send("tg " + message.author.toString())
    }
    if (message.content.includes("d-_-b")) {
        message.channel.send("d-_-b")
    }
    if (message.content.includes("oui d'accord")) {
        message.channel.send("tg " + message.author.toString())
    }
    if (message.content.includes("btg")) {
        message.channel.send("tg " + message.author.toString())
    }
    if (message.content.includes("cringe")) {
        message.channel.send("c'est toi qui est cringe " + message.author.toString())
    }
    if (message.content.includes("menfou")) {
        message.channel.send("moi aussi menfou")
    }
});

client.on('messageDelete', message => {
    const logChannel = client.channels.cache.get('705481214735286282');
	logChannel.send(`A message by ${message.author.tag} was deleted.`);
});

client.on('guildBanAdd', async (guild, user) => {
    const logChannel = client.channels.cache.get('705481214735286282');
	logChannel.send(`${user.tag} got banned from ${guild.name}.`);
});

client.on('guildBanRemove', async (guild, user) => {
    const logChannel = client.channels.cache.get('705481214735286282');
	logChannel.send(`${user.tag} got unbanned from ${guild.name}.`);
});

client.on('guildMemberRemove', member => {
    const logChannel = client.channels.cache.get('705481214735286282');
	logChannel.send(`${member.user.tag} got kicked.`);
});

client.login(token);