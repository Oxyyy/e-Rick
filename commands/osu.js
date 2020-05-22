const { MessageEmbed } = require("discord.js");
const { rose } = require("../colours.json");
const fetch = require("node-fetch");
const Nodesu = require("nodesu");
const config = require("../config.json");
const api = new Nodesu.Client(config.osuToken);
const db = require("quick.db");
const numberFormat = require("../functions/numberFormat.js");

module.exports = {
  name: "osu",
  description:
    "Answers with the osu! profile details of the corresponding user",
  // args: true,
  usage: "<joueur> <mode> (0=std|1=taiko|2=ctb|3=mania, default is std)",
  aliases: ["profile", "o", "p"],
  cooldown: 5,

  async execute(message, args) {
    var mode = 0;
    let player;

    switch (true) {
      case !args.length:
        if (!db.get(message.author.id))
          return message.reply(
            "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
          );
        else {
          player = db.get(message.author.id);
          player = Object.values(player);
        }
        break;
      case args.length === 1:
        player = args[0];
        break;
      case args.length === 2:
        player = args[0];
        mode = args[1];
        break;
      default:
        return message.reply("Arguments invalides!");
    }

    let waitingMsg = await message.channel.send(
      `\`Récupération des données.\``
    );
    setTimeout(async function () {
      await waitingMsg.edit(`\`Récupération des données..\``);
    }, 20);
    setTimeout(async function () {
      await waitingMsg.edit(`\`Récupération des données...\``);
    }, 40);

    try {
      api.user.get(player, (Nodesu.mode = mode)).then(async (userInfo) => {
        if (userInfo === undefined)
          return message.reply("joueur invalide!"), waitingMsg.delete();
        var playtime = Math.round(userInfo.total_seconds_played / 3600);
        var accuracy = parseFloat(userInfo.accuracy);
        accuracy = accuracy.toFixed(2);
        var pp = Math.round(userInfo.pp_raw);
        var username = userInfo.username;

        let joinDate = userInfo.join_date.slice(0, 10);

        let formattedRank = numberFormat.execute(userInfo.pp_rank); // formatting data for readability
        let formattedCountryRank = numberFormat.execute(
          userInfo.pp_country_rank
        );
        let formattedPP = numberFormat.execute(pp);
        let formattedPlaycount = numberFormat.execute(userInfo.playcount);
        let formattedPlaytime = numberFormat.execute(playtime);
        let level = parseFloat(userInfo.level)
        level = level.toFixed(2)


        let embed = new MessageEmbed()
          .setColor(rose)
          .addFields(
            {
              name: `**Performance:**`,
              value: `
              **🠶 #${formattedRank} :earth_africa:
              🠶 #${formattedCountryRank} :flag_${userInfo.country.toLowerCase()}:
              🠶 ${formattedPP}pp
              🠶 ${accuracy}% avg.**
              `,
              inline: true,
            },
            {
              name: `**Progression:**`,
              value: `
              **🠶 ${formattedPlaytime} hours played
              🠶 ${formattedPlaycount} plays
              🠶 Level ${level}
              🠶 Joined ${joinDate}**
              `,
              inline: true,
            },
          )
          .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/4/44/Osu%21Logo_%282019%29.png`)
          .setAuthor(
            `${username} on osu!`,
            `https://a.ppy.sh/${userInfo.user_id}?1569169881.png`,
            `https://osu.ppy.sh/users/${userInfo.user_id}`
          )
        //   .setFooter(`Joined: ${joinDate} | Level: ${userInfo.level}`)
          .setURL(`https://osu.ppy.sh/users/${userInfo.user_id}`);

        waitingMsg.delete();
        message.channel.send(embed);
      });
    } catch (error) {
      waitingMsg.delete();
      message.reply(
        "une erreur est survenue, c'est pas normal faut le dire à Oxy!!!!"
      );
      message.channel.send(`\`${error.name} : ${error.message}\``);
    }
  },
};
