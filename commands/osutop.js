const Discord = require("discord.js");
const config = require("../config.json");
const { blue } = require("../colours.json");
const osu = require("node-osu");
const db = require("quick.db");
const moment = require("moment");
const rankingIconEmoji = require('../functions/rankingIconEmoji.js')

const osuApi = new osu.Api(config.osuToken, {
  parseNumeric: true, // Parse numeric values into numbers/floats, excluding ids
  notFoundAsError: false,
  completeScores: true,
});

module.exports = {
  name: "osutop",
  aliases: ["top", "t"],

  async execute(message, args) {
    let userID;
    switch (true) {
      case args.length > 0:
        userID = args.join("_");
        break;
      default: {
        if (!db.get(message.author.id))
          return message.reply(
            "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
          );
        else {
          userID = db.get(message.author.id);
          userID = Object.values(userID);
        }
      }
    }

    let result = await osuApi.getUserBest({ u: userID }).then((scores) => {
      return {
        1: scores[0],
        2: scores[1],
        3: scores[2],
        4: scores[3],
        5: scores[4],
        6: scores[5],
        7: scores[6],
        8: scores[7],
        9: scores[8],
        10: scores[9],
      };
    });
    result = Object.values(result);
    console.log(result)
    if (!result[0]) return message.channel.send('Cet utilisateur n\'existe pas!')

    let userInfo = await osuApi.apiCall('/get_user', { u: userID }).then(user => {
        return {
            name: user[0].username,
            country: user[0].country
        } 
    });

    let scoreLink = await osuApi.apiCall('/get_user_best', { u: userID }).then(data => {
        return {
            1: data[0].score_id,
            2: data[1].score_id,
            3: data[2].score_id,
            4: data[3].score_id,
            5: data[4].score_id,
            6: data[5].score_id,
            7: data[6].score_id,
            8: data[7].score_id,
            9: data[8].score_id,
            10: data[9].score_id,
        }
    });

    let liste = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let firstCut = 0;
    let secondCut = 5;

    let embedConstructor = new Discord.MessageEmbed()
      .setColor(blue)
      .setAuthor(
        `osu! top scores of ${userInfo.name}`,
        `https://osu.ppy.sh/images/flags/${userInfo.country}.png`,
        `https://osu.ppy.sh/users/${result[0].user.id}`
      )
      .setThumbnail(`https://a.ppy.sh/${result[0].user.id}?1569169881.png`)
      

    async function prepareEmbed(result, scoreLink, liste, firstCut, secondCut) {
      embedConstructor.fields = [];
      let listeDisplay = liste.slice(firstCut, secondCut);

      listeDisplay.forEach((element) => {
        let currPosition = liste.indexOf(element);
        let score = result[currPosition];

        let mapArtist = score._beatmap.artist;
        let mapTitle = score._beatmap.title;
        let mapDiff = score._beatmap.version;
        let rankingIcon = rankingIconEmoji.execute(score.rank)
        let pp = score.pp.toFixed();
        let acc = (score.accuracy*100).toFixed(2);
        let combo = score.maxCombo;
        let maxCombo = score._beatmap.maxCombo;
        let missCount = score.counts['miss']
        let dateSubmitted = moment(
          score.raw_date,
          "YYYY-MM-DD HH:mm:SS"
        ).fromNow();
        let scoreLink2 = scoreLink[currPosition+1]

        if (!missCount) {
            missCount = ""
        }
        else {
            missCount = `(${missCount}m)`
        }

        embedConstructor.addField(
          `**${element}. ${mapArtist} - ${mapTitle} [${mapDiff}]**`,
          `** ${rankingIcon} 🠶 ${pp}pp **| ${acc}% ${missCount} | ${combo} / ${maxCombo} | [${dateSubmitted}](https://osu.ppy.sh/scores/osu/${scoreLink2})`
        );
      });
      return embedConstructor;
    }

    embed = await prepareEmbed(result, scoreLink, liste, 0, 5);
    message.channel.send(embed).then((embedEdit) => {
      const filter = (reaction, user) => {
        return (
          ["🔼", "🔽"].includes(reaction.emoji.name) &&
          user.id !== embedEdit.author.id
        );
      };

      async function botReact(firstCut, secondCut, embedEdit) {
        if (firstCut >= 5) {
          embedEdit.react("🔼");
        }
        if (secondCut < 9) {
          embedEdit.react("🔽");
        }
      }
      async function reactionWait(
        filter,
        firstCut,
        secondCut,
        embedEdit,
        liste
      ) {
        embedEdit
          .awaitReactions(filter, {
            max: 1,
            time: 30000,
            errors: ["time"],
          })
          .then(async (collected) => {
            const reaction = collected.first();

            if (reaction.emoji.name === "🔼") {
              firstCut -= 5;
              secondCut -= 5;
              embed = await prepareEmbed(result,  scoreLink, liste, firstCut, secondCut);
              embedEdit.edit(embed);
              embedEdit.reactions.removeAll();
              botReact(firstCut, secondCut, embedEdit);
              reactionWait(filter, firstCut, secondCut, embedEdit, liste);
            }

            if (reaction.emoji.name === "🔽") {
              firstCut += 5;
              secondCut += 5;
              embed = await prepareEmbed(result, scoreLink, liste, firstCut, secondCut);
              embedEdit.edit(embed);
              embedEdit.reactions.removeAll();
              botReact(firstCut, secondCut, embedEdit);
              reactionWait(filter, firstCut, secondCut, embedEdit, liste);
            }
          })
          .catch((collected) => {
            // if no reactions after 15 seconds, delete them
            embedEdit.reactions
              .removeAll()
              .catch((error) =>
                console.error("Failed to clear reactions: ", error)
              );
          });
      }

      botReact(firstCut, secondCut, embedEdit);
      reactionWait(filter, firstCut, secondCut, embedEdit, liste);
    });
  },
};
