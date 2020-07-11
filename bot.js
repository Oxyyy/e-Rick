const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const masterID = process.env.OWNER;
const token = process.env.TOKEN;

const fs = require("fs");
const Discord = require("discord.js");
var {
  RNGMarkovOccurence,
  welcomeChannelID,
  masterID2,
  UTCincrement,
  logChannelID,
  debugChannelID,
} = require("./config.json");
const db = require("quick.db");
let prefix;

logChannelID = logChannelID.toString();
welcomeChannelID = welcomeChannelID.toString();

// INITIALIZE DATABASE

const firebase = require('firebase/app');
const FieldValue = require('firebase-admin').firestore.FieldValue
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://e-rick-ad9a6.firebaseio.com"
})

let fb = admin.firestore();

//

const client = new Discord.Client();
client.commands = new Discord.Collection();

client.on('guildCreate', async gData => {
  console.log(`New guild joined: ${gData.name}`)
  fb.collection('guilds').doc(gData.id).set({
    'guildID' : gData.id,
    'guildName' : gData.name,
    'guildOwner' : gData.owner.user.username,
    'guildOwnerID' : gData.owner.id,
    'guildMemberCount' : gData.memberCount,
    'prefix' : '!',
    'recentMap' : '131891'
  })
})

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

const markov = require("./functions/markov.js");

var today = new Date();
var date =
  today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
var hours = today.getHours() + UTCincrement;
if (hours >= 24) {
  hours -= 24;
}
var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds();

client.once("ready", () => {
  console.log("Connected as " + client.user.tag);
  logChannelID = client.channels.cache.get(logChannelID); // Replace with known channel ID
  logChannelID.send(`\`Restarted: ${date} ${time}\``);
  client.user.setActivity("le Sanctuaire", { type: "WATCHING" });
});

client.on("guildMemberUpdate", (oldMember, newMember) => {
  // If the role(s) are present on the old member object but no longer on the new one (i.e role(s) were removed)
  const removedRoles = oldMember.roles.cache.filter(
    (role) => !newMember.roles.cache.has(role.id)
  );

  if (removedRoles.size > 0)
    logChannelID.send(
      `\`The roles ${removedRoles.map((r) => r.name)} were removed from ${
        oldMember.displayName
      }.\``
    );
  // If the role(s) are present on the new member object but are not on the old one (i.e role(s) were added)
  const addedRoles = newMember.roles.cache.filter(
    (role) => !oldMember.roles.cache.has(role.id)
  );
  if (addedRoles.size > 0)
    logChannelID.send(
      `\`The roles ${addedRoles.map((r) => r.name)} were added to ${
        oldMember.displayName
      }.\``
    );
});

client.on("message", (message) => {
  let tempGuildID;
  if (message.channel.type === "dm") {
    tempGuildID = message.author.tag
  }
  else tempGuildID = message.guild.id;

  fb.collection('guilds').doc(tempGuildID).get().then((q) => {
    if (q.exists) {
      prefix = q.data().prefix
    }
  }).then(()  => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    console.log(message.content);
  logChannelID.send(
    `\`Command received (author: ${message.author.tag}): ${message.content}\``
  );

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.admin && !message.author.id.includes(masterID)) {
    switch (true) {
      case !message.author.id.includes(masterID2):
        return message.reply("accès refusé!");
        break;
    }
  }

  if (command.channelLimit) {
    if (message.channel.id !== debugChannelID) {
      // console.log(message.channel.id);
      if (!command.debug) {
        if (
          message.channel.id != command.channelLimit &&
          message.channel.type === "text"
        ) {
          let appropriateChannelID = command.channelLimit.toString();
          appropriateChannelName = client.channels.cache.get(
            `${appropriateChannelID}`
          );
          return message.channel.send(
            `Cette commande ne peut pas être utilisée ici! Channel approprié: ${appropriateChannelName}`
          );
        }
      }
    }
  }

  if (command.guildOnly && message.channel.type !== "text") {
    // check si la commande est exécutée en DM
    return message.reply("Cette commande ne peut pas être exécutée en DMs!");
  }

  if (command.wip) return message.reply("cette commande n'est pas finie!");

  if (command.args && !args.length) {
    // check les arguments | donne l'usage standard
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
      command.execute(message, args, fb); // execute le fichier js correspondant à la commande
      return;
    } catch (error) {
      console.error(error);
      message.reply(
        "Une erreur a empêché la commande de s'effectuer correctement!"
      );
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
      return message.reply(
        `vous devez attendre ${timeLeft.toFixed(
          1
        )} secondes avant d'effectuer la commande \`${command.name}\``
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    command.execute(message, args, fb); // execute le fichier js correspondant à la commande
  } catch (error) {
    console.error(error);
    message.reply(
      "Une erreur a empêché la commande de s'effectuer correctement!"
    );
  }
});
  })

  

client.on("message", (message) => {
  if (message.author == client.user) {
    return;
  }

  if (message.content.includes("https://osu.ppy.sh/beatmapsets/")) {
    if (message.channel.id.includes("702628237791985674")) {
      let recentMapID = message.content.split("/");
      recentMapID = parseFloat(recentMapID[5]);
      fb.collection('guilds').doc(message.guild.id).update({
        recentMap: recentMapID
      })
    }
  }

  if (message.content.includes("quade")) {
    const attachment = new Discord.MessageAttachment('https://media.tenor.com/images/4121cde2b1e9530a87cbca262812f7ca/tenor.gif')
      message.channel.send(attachment)
    }

  if (message.content.includes(client.user.id)) {
    RNGMarkov = Math.floor(Math.random() * (RNGMarkovOccurence / 100));
    RNGMarkov2 = Math.floor(Math.random() * (RNGMarkovOccurence / 100));
    if (RNGMarkov === RNGMarkov2) {
      markov.execute(message);
    }
  }
  RNGMarkov = Math.floor(Math.random() * RNGMarkovOccurence);
  RNGMarkov2 = Math.floor(Math.random() * RNGMarkovOccurence);
  if (RNGMarkov === RNGMarkov2) {
    markov.execute(message);
  }
  messageLowCase = message.content.toLowerCase();
  if (messageLowCase.includes("e-rick")) {
    RNGMarkov = Math.floor(Math.random() * (RNGMarkovOccurence / 100));
    RNGMarkov2 = Math.floor(Math.random() * (RNGMarkovOccurence / 100));
    if (RNGMarkov === RNGMarkov2) {
      markov.execute(message);
    }
  }
});

client.on("messageDelete", (message) => {
  if (message.author.tag === "e-Rick#4612") return;
  logChannelID.send(`\`A message by ${message.author.tag} was deleted.\``);
});

client.on("guildBanAdd", async (guild, user) => {
  logChannelID.send(`\`${user.tag} got banned from ${guild.name}.\``);
});

client.on("guildBanRemove", async (guild, user) => {
  logChannelID.send(`\`${user.tag} got unbanned from ${guild.name}.\``);
});

client.on("guildMemberRemove", (member) => {
  logChannelID.send(`\`${member.user.tag} got kicked.\``);
});


client.login(token);
