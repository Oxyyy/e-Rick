// const fb = require("quick.db");
const osu = require("node-osu")
const config = require('../config.json')

const osuApi = new osu.Api(config.osuToken, {
  parseNumeric: true, // Parse numeric values into numbers/floats, excluding ids
  notFoundAsError: false,
  completeScores: true,
});

module.exports = {
  name: "osulink",
  description: "Allows to link your osu! account to e-Rick",
  aliases: ["link"],
  args: true,
  usage: "<LE PSEUDO OSU OU L'ID OSU LA PUTAIN DE TA RACE>",
  cooldown: 5,
  async execute(message, args, fb) {
  //   if (args[0] === "-check") {
  //     if (!db.get(message.author.id)) {
  //       return message.reply("votre compte n'est pas lié!");
  //     } else {
  //       message.channel.send(
  //         `Votre compte est lié à l\'osu! ID suivant: \`${Object.values(
  //           db.get(message.author.id)
  //         )}\``
  //       );
  //     }
  //   } else {
  //     db.set(message.author.id, { UserID: args[0] });
  //     message.channel.send(
  //       `Votre compte Discord a été lié à l'ID suivant: \`${args[0]}\``
  //     );
  //   }
  // },

  let argsFormatted = args.join('_')

  let osuInfos = await osuApi.getUser({ u: argsFormatted }).then(user => {
    return {
      name: user.name,
      ID: user.id
    }
});

try {
  fb.collection('osuAccounts').doc(message.author.id).set({
    osuID: osuInfos.ID,
    osuName: osuInfos.name
  })
  message.channel.send(`Votre compte Discord a été lié au compte osu! suivant:\n\`ID: ${osuInfos.ID} | Name: ${osuInfos.name}\``)
}
catch(e) {
  console.log(e)
}





}}
