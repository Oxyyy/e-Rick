const db = require("quick.db");

module.exports = {
  name: "osulink",
  description: "Allows to link your osu! account to e-Rick",
  aliases: ["link"],
  args: true,
  usage: "<UserID>",
  cooldown: 5,
  async execute(message, args) {
    if (args[0] === "-check") {
      if (!db.get(message.author.id)) {
        return message.reply("votre compte n'est pas lié!");
      } else {
        message.channel.send(
          `Votre compte est lié à l\'ID suivant: \`${Object.values(
            db.get(message.author.id)
          )}\``
        );
      }
    } else {
      db.set(message.author.id, { UserID: args[0] });
      message.channel.send(
        `Votre compte Discord a été lié à l'ID suivant: \`${args[0]}\``
      );
    }
  },
};
