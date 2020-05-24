const { MessageEmbed } = require("discord.js");
let osu = require("node-osu");
let apiKey = require("../config.json");
let db = require("quick.db");
const { blue } = require("../colours.json");
const fetch = require("node-fetch");
const moment = require("moment");

const modFormat = require("../functions/modFormat.js"); // used to format mods into readable ones
const rankingColor = require("../functions/rankingColor.js"); // used to convert rank obtained in a color
const rankingIconEmoji = require("../functions/rankingIconEmoji.js"); // used to convert rank obtained in an icon
const numberFormat = require("../functions/numberFormat.js"); // used to format numbers for readibility
const pageToArray = require("../functions/pageToArray.js"); // used to convert the page to corresponding scores that needs to be displayed
const getPP = require("../functions/getPP.js");
const lengthFormat = require("../functions/lengthFormat.js");

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
        // if not warns the user that he needs to link his account
        return message.reply(
          "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
        );
      userID = db.get(message.author.id); // if yes retrieve the corresponding player in the local database
      userID = Object.values(userID);
    } else userID = args[0]; // else define the player as the first argument

    let recentMap = db.get("most recent map"); // retrieving the most recent map to check scores for
    recentMap = parseFloat(Object.values(recentMap));

    let msg = await message.channel.send(`\`Récupération des données.\``); // loading message
      setTimeout(async function () {
        await msg.edit(`\`Récupération des données..\``);
      }, 1000);
      setTimeout(async function () {
        await msg.edit(`\`Récupération des données...\``);
      }, 2000);

    const scoreData = osuApi // parsing scores of the user on the corresponding beatmap
      .getScores({ b: recentMap, u: userID })
      .then((scores) => {
        if (!scores[0])
          // checking if the user has any available score
          return message.reply("cet utilisateur n'a aucun score sur cette map");
        fetch(
          `https://osu.ppy.sh/api/get_scores?k=${apiKey.osuToken}&b=${recentMap}&u=${userID}`
        )
          .then(async (res) => res.json())
          .then(async (body) => {
            let rankObtained = scores[0].rank;
            let embedColor = rankingColor.execute(rankObtained); // retrieving embedcolor depending on the rank of the top score

            let submitCount = 0;
            scores.forEach((element) => {
              // counting the amount of submited scores
              submitCount += 1;
            });

            var scoresToCheck = [1, 2]; // setting up the default scores to display in the embed

            async function sendEmbed(
              message,
              scores,
              scoresToCheck,
              submitCount
            ) {
              // main function that prepares the embed for every page to display
              let totalPages = Math.ceil(submitCount / 2); // calculating the pages to display a page indicator in footer
              let currentPage = scoresToCheck[1] / 2;

              let mapper = scores[0]._beatmap.creator;
              let approvalStatus = scores[0]._beatmap.approvalStatus;
              let rankedAgo = moment(
                scores[0]._beatmap.raw_approvedDate,
                "YYYY-MM-DD HH:mm:SS"
              ).fromNow();
              let mapLength = lengthFormat.execute(
                scores[0]._beatmap.length["total"]
              );
              let mapBPM = scores[0]._beatmap.bpm;

              let embed = new MessageEmbed() // embed constructor
                .setColor(embedColor)
                .setAuthor(
                  `Now comparing to ${scores[0].user.name}`,
                  `https://a.ppy.sh/${scores[0].user.id}?1569169881.png`,
                  `https://osu.ppy.sh/users/${scores[0].user.id}`
                )
                .setImage(
                  `https://assets.ppy.sh/beatmaps/${scores[0]._beatmap.beatmapSetId}/covers/cover.jpg?1547927639`
                )
                .setFooter(`Page ${currentPage} of ${totalPages} | ${mapper} | ${approvalStatus} ${rankedAgo} | ${mapLength} | ${mapBPM}BPM`)
                .setTitle(
                  `${scores[0]._beatmap.artist} - ${scores[0]._beatmap.title} [${scores[0]._beatmap.version}]`
                )
                .setURL(
                  `https://osu.ppy.sh/beatmapsets/${scores[0]._beatmap.beatmapSetId}#osu/${scores[0]._beatmap.id}`
                );

              if (scoresToCheck[1] - 1 !== submitCount) {
                // check if the embed needs to have 2 fields

                let enabledMods1 = scores[scoresToCheck[0] - 1].mods.join(""); // retrieving enabled mods on both scores
                enabledMods1 = modFormat.execute(enabledMods1);

                let enabledMods2 = scores[scoresToCheck[1] - 1].mods.join("");
                enabledMods2 = modFormat.execute(enabledMods2);

                let rankingIcon1 = scores[scoresToCheck[0] - 1].rank; // retrieving rank obtained icon on both scores
                rankingIcon1 = rankingIconEmoji.execute(rankingIcon1);

                let rankingIcon2 = scores[scoresToCheck[1] - 1].rank;
                rankingIcon2 = rankingIconEmoji.execute(rankingIcon2);

                let rawNumber1 = scores[scoresToCheck[0] - 1].score; // retrieving total score on both scores
                let totalScore1 = numberFormat.execute(rawNumber1);

                let rawNumber2 = scores[scoresToCheck[1] - 1].score;
                let totalScore2 = numberFormat.execute(rawNumber2);

                let beatmapID = scores[0]._beatmap.id;
                let accuracy1 = (
                  scores[scoresToCheck[0] - 1].accuracy * 100
                ).toFixed(2);
                let accuracy2 = (
                  scores[scoresToCheck[1] - 1].accuracy * 100
                ).toFixed(2);
                let combo1 = scores[scoresToCheck[0] - 1].maxCombo;
                let combo2 = scores[scoresToCheck[1] - 1].maxCombo;
                let missCount1 = scores[scoresToCheck[0] - 1].counts.miss;
                let missCount2 = scores[scoresToCheck[1] - 1].counts.miss;

                let getPPData1 = await getPP.execute(
                  beatmapID,
                  enabledMods1,
                  accuracy1,
                  combo1,
                  missCount1
                );
                let pp1 = getPPData1.pp;
                let sr1 = getPPData1.sr;

                let getPPData2 = await getPP.execute(
                  beatmapID,
                  enabledMods2,
                  accuracy2,
                  combo2,
                  missCount2
                );
                let pp2 = getPPData2.pp;
                let sr2 = getPPData2.sr;

                let FC1 = false; // detect if the first score is an fc
                if (
                  scores[scoresToCheck[0] - 1].maxCombo >=
                  scores[0]._beatmap.maxCombo - 10
                ) {
                  FC1 = true;
                }
                let FC2 = false; // detect if the second score is an fc
                if (
                  scores[scoresToCheck[1] - 1].maxCombo >=
                  scores[0]._beatmap.maxCombo - 10
                ) {
                  FC2 = true;
                }

                let SS1 = false;
                if (accuracy1 == 100.0) {
                  SS1 = true;
                }
                let SS2 = false;
                if (accuracy2 == 100.0) {
                  SS2 = true;
                }

                let embedPPIF = "";
                let embedPPIF2 = "";

                if (!FC1) {
                  let getPPFCData1 = await getPP.execute(
                    beatmapID,
                    enabledMods1,
                    accuracy1,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF = "(" + getPPFCData1.pp + "pp if FC)";
                } else if (!SS1) {
                  let getPPFCData1 = await getPP.execute(
                    beatmapID,
                    enabledMods1,
                    100,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF = "(" + getPPFCData1.pp + "pp if SS)";
                }

                if (!FC2) {
                  let getPPFCData2 = await getPP.execute(
                    beatmapID,
                    enabledMods2,
                    accuracy1,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF2 = "(" + getPPFCData2.pp + "pp if FC)";
                } else if (!SS2) {
                  let getPPFCData2 = await getPP.execute(
                    beatmapID,
                    enabledMods2,
                    100,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF2 = "(" + getPPFCData2.pp + "pp if SS)";
                }

                let raw_date1 = scores[scoresToCheck[0] - 1].raw_date;
                let raw_date2 = scores[scoresToCheck[1] - 1].raw_date;

                let timeAgo1 = moment(
                  raw_date1,
                  "YYYY-MM-DD HH:mm:SS"
                ).fromNow();
                let timeAgo2 = moment(
                  raw_date2,
                  "YYYY-MM-DD HH:mm:SS"
                ).fromNow();

                let scoreID1 = body[scoresToCheck[0] - 1].score_id;
                let scoreID2 = body[scoresToCheck[1] - 1].score_id;

                embed.addFields(
                  // part impossible à lire mdr en gros je design l'embed dedans
                  {
                    name: `**${scoresToCheck[0]}. +${enabledMods1} (${sr1}★)**`,
                    value: `
              **${rankingIcon1} 🠶 ${pp1}pp ${embedPPIF}
              🠶 ${(scores[scoresToCheck[0] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[0] - 1].counts["100"]} / ${
                      scores[scoresToCheck[0] - 1].counts["50"]
                    } / ${scores[scoresToCheck[0] - 1].counts.miss}m
              🠶 ${totalScore1} | ${scores[scoresToCheck[0] - 1].maxCombo} / ${
                      scores[0]._beatmap.maxCombo
                    }
                    🠶 [Score set ${timeAgo1}](https://osu.ppy.sh/scores/osu/${scoreID1})**`,
                    inline: true,
                  },
                  {
                    name: `**${scoresToCheck[1]}. +${enabledMods2} (${sr2}★)**`,
                    value: `
              **${rankingIcon2} 🠶 ${pp2}pp ${embedPPIF2}
              🠶 ${(scores[scoresToCheck[1] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[1] - 1].counts["100"]} / ${
                      scores[scoresToCheck[1] - 1].counts["50"]
                    } / ${scores[scoresToCheck[1] - 1].counts.miss}m
              🠶 ${totalScore2} | ${scores[scoresToCheck[1] - 1].maxCombo} / ${
                      scores[0]._beatmap.maxCombo
                    }
                    [Score set ${timeAgo2}](https://osu.ppy.sh/scores/osu/${scoreID2}) **`,
                    inline: true,
                  }
                );
                return embed; // returning the embed out of the function to call it later
              } else {
                // only display a single field (i.e last page of scores)
                let enabledMods1 = scores[scoresToCheck[0] - 1].mods.join(""); // retrieving enabled mods on the score
                enabledMods1 = modFormat.execute(enabledMods1);

                let rankingIcon1 = scores[scoresToCheck[0] - 1].rank; // retrieving obtained rank icon on the score
                rankingIcon1 = rankingIconEmoji.execute(rankingIcon1);

                let rawNumber1 = scores[scoresToCheck[0] - 1].score; // retrieving total score on the score
                let totalScore1 = numberFormat.execute(rawNumber1);

                let accuracy1 = (
                  scores[scoresToCheck[0] - 1].accuracy * 100
                ).toFixed(2);

                let combo1 = scores[scoresToCheck[0] - 1].maxCombo;
                let missCount1 = scores[scoresToCheck[0] - 1].counts.miss;
                let beatmapID = scores[0]._beatmap.id;

                let getPPData1 = await getPP.execute(
                  beatmapID,
                  enabledMods1,
                  accuracy1,
                  combo1,
                  missCount1
                );
                let pp1 = getPPData1.pp;
                let sr1 = getPPData1.sr;

                let FC1 = false; // detect if the first score is an fc
                if (
                  scores[scoresToCheck[0] - 1].maxCombo >=
                  scores[0]._beatmap.maxCombo - 10
                ) {
                  FC1 = true;
                }

                let SS1 = false;
                if (accuracy1 == 100.0) {
                  SS1 = true;
                }

                let embedPPIF = "";

                if (!FC1) {
                  let getPPFCData1 = await getPP.execute(
                    beatmapID,
                    enabledMods1,
                    accuracy1,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF = "(" + getPPFCData1.pp + "pp if FC)";
                } else if (!SS1) {
                  let getPPFCData1 = await getPP.execute(
                    beatmapID,
                    enabledMods1,
                    100,
                    scores[0]._beatmap.maxCombo,
                    0
                  );
                  embedPPIF = "(" + getPPFCData1.pp + "pp if SS)";
                }

                let raw_date1 = scores[scoresToCheck[0] - 1].raw_date;
                let timeAgo1 = moment(
                  raw_date1,
                  "YYYY-MM-DD HH:mm:SS"
                ).fromNow();

                let scoreID1 = body[scoresToCheck[0] - 1].score_id;

                embed.addFields({
                  // part impossible à lire mdr en gros je design l'embed dedans
                  name: `**${scoresToCheck[0]}. +${enabledMods1} (${sr1}★)**`,
                  value: `
              **${rankingIcon1} 🠶 ${pp1}pp ${embedPPIF}
              🠶 ${(scores[scoresToCheck[0] - 1].accuracy * 100).toFixed(
                2
              )}% | ${scores[scoresToCheck[0] - 1].counts["100"]} / ${
                    scores[scoresToCheck[0] - 1].counts["50"]
                  } / ${scores[scoresToCheck[0] - 1].counts.miss}m
              🠶 ${totalScore1} | ${scores[scoresToCheck[0] - 1].maxCombo} / ${
                    scores[0]._beatmap.maxCombo
                  }
                  🠶 [Score set ${timeAgo1}](https://osu.ppy.sh/scores/osu/${scoreID1})**`,
                  inline: true,
                });
                return embed; // returning the embed out of the function to call it later
              }
            }

            let embed1 = await sendEmbed(
              message,
              scores,
              scoresToCheck,
              submitCount
            );
            msg.delete()
            message.channel.send(embed1).then((embedEdit) => {
              // posting the first embed, listening for any reactions after that
              if (Math.ceil(submitCount / 2) >= 2) {
                // reacting to the embed with every page available
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
                // filtering valid reactions by user
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
                  ].includes(reaction.emoji.name) &&
                  user.id === message.author.id
                );
              };

              embedEdit
                .awaitReactions(filter, {
                  max: 1,
                  time: 60000,
                  errors: ["time"],
                }) // listens for reactions in the next 60 seconds
                .then(async (collected) => {
                  const reaction = collected.first();

                  if (reaction.emoji.name === "1️⃣") {
                    // if user reacts for the first page
                    embedEdit.reactions.removeAll(); // remove every reactions
                    scoresToCheck = pageToArray.execute(1); // retrieve the scores that needs to be displayed (1 and 2)
                    let embed2 = await sendEmbed(
                      // re-load the embed
                      message,
                      scores,
                      scoresToCheck,
                      submitCount
                    );
                    embedEdit.edit(embed2); // edits the old embed with the correct one (the page asked for)
                  }
                  if (reaction.emoji.name === "2️⃣") {
                    embedEdit.reactions.removeAll();
                    scoresToCheck = pageToArray.execute(2);
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
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
                    let embed2 = await sendEmbed(
                      message,
                      scores,
                      scoresToCheck,
                      submitCount
                    );
                    embedEdit.edit(embed2);
                  }
                })
                .catch((collected) => {
                  // if no reactions after 60 seconds, delete them
                  embedEdit.reactions
                    .removeAll()
                    .catch((error) =>
                      console.error("Failed to clear reactions: ", error)
                    );
                });
            });
          });
      });
  },
};
