const { MessageEmbed } = require("discord.js");
let osu = require("node-osu");
let apiKey = require("../config.json");
let db = require("quick.db");
const { blue } = require("../colours.json");
const fetch = require("node-fetch");

const modFormat = require("../functions/modFormat.js");
const rankingColor = require("../functions/rankingColor.js");
const rankingIconEmoji = require("../functions/rankingIconEmoji.js");
const numberFormat = require("../functions/numberFormat.js");
const pageToArray = require("../functions/pageToArray.js");

const osuApi = new osu.Api(apiKey.osuToken, {
  parseNumeric: true, // Parse numeric values into numbers/floats, excluding ids
  notFoundAsError: false,
  completeScores: true,
});

module.exports = {
  name: "compare",
  aliases: ["c", "comp"],
  channelLimit: "702628237791985674",
  cooldown: 30,

  async execute(message, args) {
    let userID;
    if (!args.length) {
      // checking if the player exists in the local database
      if (!db.get(message.author.id))
        return message.reply(
          "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
        );
      userID = db.get(message.author.id);
      userID = Object.values(userID);
    } else userID = args[0];

    let recentMap = db.get("most recent map");
    recentMap = parseFloat(Object.values(recentMap));

    const scoreData = osuApi
      .getScores({ b: recentMap, u: userID })
      .then((scores) => {
        if (!scores[0])
          return message.reply("cet utilisateur n'a aucun score sur cette map");

        // let msg = await message.channel.send('Chargement des données...')

        let rankObtained = scores[0].rank;
        let embedColor = rankingColor.execute(rankObtained);

        let submitCount = 0;
        scores.forEach((element) => {
          submitCount += 1;
        });

        pageCount = Math.ceil(submitCount / 2);

        var scoresToCheck = [1, 2];

        function sendEmbed(message, scores, scoresToCheck, submitCount) {
          let totalPages = Math.ceil(submitCount / 2);
          let currentPage = scoresToCheck[1] / 2;

          let embed = new MessageEmbed()
            .setColor(embedColor)
            .setAuthor(
              `Now comparing to ${scores[0].user.name}`,
              `https://a.ppy.sh/${scores[0].user.id}?1569169881.png`,
              `https://osu.ppy.sh/users/${scores[0].user.id}`
            )
            .setImage(
              `https://assets.ppy.sh/beatmaps/${scores[0]._beatmap.beatmapSetId}/covers/cover.jpg?1547927639`
            )
            .setFooter(`Page ${currentPage} of ${totalPages}`)
            .setTitle(
              `${scores[0]._beatmap.title} [${scores[0]._beatmap.version}]`
            )
            .setURL(
              `https://osu.ppy.sh/beatmapsets/${scores[0]._beatmap.beatmapSetId}#osu/${scores[0]._beatmap.id}`
            );

          if (scoresToCheck[1] - 1 !== submitCount) {
            let enabledMods1 = scores[scoresToCheck[0] - 1].mods.join("");
            enabledMods1 = modFormat.execute(enabledMods1);

            let enabledMods2 = scores[scoresToCheck[1] - 1].mods.join("");
            enabledMods2 = modFormat.execute(enabledMods2);

            let rankingIcon1 = scores[scoresToCheck[0] - 1].rank;
            rankingIcon1 = rankingIconEmoji.execute(rankingIcon1);

            let rankingIcon2 = scores[scoresToCheck[1] - 1].rank;
            rankingIcon2 = rankingIconEmoji.execute(rankingIcon2);

            let rawNumber1 = scores[scoresToCheck[0] - 1].score;
            let totalScore1 = numberFormat.execute(rawNumber1);

            let rawNumber2 = scores[scoresToCheck[1] - 1].score;
            let totalScore2 = numberFormat.execute(rawNumber2);

            embed.addFields(
              {
                name: `**${scoresToCheck[0]}. +${enabledMods1}**`,
                value: `
              **${rankingIcon1} 🠶 ${scores[
                  scoresToCheck[0] - 1
                ].pp.toFixed()}pp 
              🠶 ${(scores[scoresToCheck[0] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[0] - 1].counts["100"]} / ${
                  scores[scoresToCheck[0] - 1].counts["50"]
                } / ${scores[scoresToCheck[0] - 1].counts.miss}m
              🠶 ${totalScore1} | ${scores[scoresToCheck[0] - 1].maxCombo} / ${
                  scores[0]._beatmap.maxCombo
                }**`,
                inline: true,
              },
              {
                name: `**${scoresToCheck[1]}. +${enabledMods2}**`,
                value: `
              **${rankingIcon2} 🠶 ${scores[
                  scoresToCheck[1] - 1
                ].pp.toFixed()}pp 
              🠶 ${(scores[scoresToCheck[1] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[1] - 1].counts["100"]} / ${
                  scores[scoresToCheck[1] - 1].counts["50"]
                } / ${scores[scoresToCheck[1] - 1].counts.miss}m
              🠶 ${totalScore2} | ${scores[scoresToCheck[1] - 1].maxCombo} / ${
                  scores[0]._beatmap.maxCombo
                }**`,
                inline: true,
              }
            );
            return embed;
          } else {
            let enabledMods1 = scores[scoresToCheck[0] - 1].mods.join("");
            enabledMods1 = modFormat.execute(enabledMods1);

            let rankingIcon1 = scores[scoresToCheck[0] - 1].rank;
            rankingIcon1 = rankingIconEmoji.execute(rankingIcon1);

            let rawNumber1 = scores[scoresToCheck[0] - 1].score;
            let totalScore1 = numberFormat.execute(rawNumber1);

            embed.addFields({
              name: `**${scoresToCheck[0]}. +${enabledMods1}**`,
              value: `
              **${rankingIcon1} 🠶 ${scores[
                scoresToCheck[0] - 1
              ].pp.toFixed()}pp 
              🠶 ${(scores[scoresToCheck[0] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[0] - 1].counts["100"]} / ${
                scores[scoresToCheck[0] - 1].counts["50"]
              } / ${scores[scoresToCheck[0] - 1].counts.miss}m
              🠶 ${totalScore1} | ${scores[scoresToCheck[0] - 1].maxCombo} / ${
                scores[0]._beatmap.maxCombo
              }**`,
              inline: true,
            });
            return embed;
          }
        }

        let embed1 = sendEmbed(message, scores, scoresToCheck, submitCount);
        message.channel.send(embed1).then((embedEdit) => {
          if (Math.ceil(submitCount / 2) >= 2) {
            embedEdit.react("2️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 3) {
            embedEdit.react("3️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 4) {
            embedEdit.react("4️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 5) {
            embedEdit.react("5️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 6) {
            embedEdit.react("6️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 7) {
            embedEdit.react("7️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 8) {
            embedEdit.react("8️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 9) {
            embedEdit.react("9️⃣");
          }
          if (Math.ceil(submitCount / 2) >= 10) {
            embedEdit.react("🔟");
          }

          const filter = (reaction, user) => {
            return (
              [
                "1️⃣",
                "2️⃣",
                "3️⃣",
                "4️⃣",
                "5️⃣",
                "6️⃣",
                "7️⃣",
                "8️⃣",
                "9️⃣",
                "🔟",
              ].includes(reaction.emoji.name) && user.id === message.author.id
            );
          };

          embedEdit
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then((collected) => {
              const reaction = collected.first();

              if (reaction.emoji.name === "1️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(1);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "2️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(2);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "3️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(3);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "4️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(4);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "5️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(5);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "6️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(6);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "7️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(7);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "8️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(8);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "9️⃣") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(9);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
              if (reaction.emoji.name === "🔟") {
                embedEdit.reactions.removeAll();
                scoresToCheck = pageToArray.execute(10);
                let embed2 = sendEmbed(
                  message,
                  scores,
                  scoresToCheck,
                  submitCount
                );
                embedEdit.edit(embed2);
              }
            })
            .catch((collected) => {
              embedEdit.reactions
                .removeAll()
                .catch((error) =>
                  console.error("Failed to clear reactions: ", error)
                );
            });
        });
      });
  },
};
