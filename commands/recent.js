const {MessageEmbed} = require ('discord.js');
const {blue} = require ('../colours.json');
const fetch = require ('node-fetch');
const config = require ('../config.json');
const tigrou = require ('node-osu');
const osuApi = new tigrou.Api (config.osuToken, {
  completeScores: true,
  parseNumeric: true,
  notFoundAsError: false,
});
const db = require ('quick.db');

const osu = require ('ojsama');
let execOjsama = require ('child_process').exec;

module.exports = {
  name: 'recent',
  description: 'Answers with details about the most recent score of a player (WIP)',
  args: false,
  channelLimit: '702628237791985674',
  usage: '<joueur|ID>',
  aliases: ['rs'],
  cooldown: 0,

  async execute (message, args) {
    try {
      let userID;
      if (!args.length) {
        if (!db.get (message.author.id))
          return message.reply (
            "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
          );
        userID = db.get (message.author.id);
        userID = Object.values (userID);
      } else userID = args[0];

      let msg = await message.channel.send (`\`Récupération des données.\``);
      setTimeout (async function () {
        await msg.edit (`\`Récupération des données..\``);
      }, 1000);
      setTimeout (async function () {
        await msg.edit (`\`Récupération des données...\``);
      }, 2000);
      let argMode = 'osu';
      if (args.length > 1) {
        switch (args[1]) {
          case 'mania':
            argMode = 'mania';
            return message.reply (
              "ce mini-jeu n'est pas encore supporté!"
            ), msg.delete ();
            break;
          case 'taiko':
            argMode = 'taiko';
            return message.reply (
              "ce mini-jeu n'est pas encore supporté!"
            ), msg.delete ();
            break;
          case 'ctb':
            argMode = 'fruits';
            return message.reply (
              "ce mini-jeu n'est pas encore supporté!"
            ), msg.delete ();
            break;
          default:
            return message.reply ('argument invalide!'), msg.delete ();
        }
      }
      // console.log(argMode);

      const recentData = osuApi
        .getUserRecent ({u: userID})
        .then (recentData => {
          if (recentData[0] === undefined)
            return message.reply (
              "ce joueur n'a pas joué ces dernières 24h!"
            ), msg.delete ();
          const userData = osuApi
            .getUser ({u: recentData[0].user.id})
            .then (userData => {
              let count50 = recentData[0].counts['50']; // pr faire plus lisible
              let count100 = recentData[0].counts['100']; // pr faire plus lisible
              let countMiss = recentData[0].counts['miss']; // pr faire plus lisible
              let totalHit =
                count50 + count100 + recentData[0].counts['300'] + countMiss; // calcule le total des objets hit par le joueur
              let totalObjects =
                recentData[0]._beatmap.objects['normal'] +
                recentData[0]._beatmap.objects['slider'] +
                recentData[0]._beatmap.objects['spinner']; // calcule le total des objets de la map
              let mapCompletion = totalHit / totalObjects * 100; // calcule la complétion
              mapCompletion = `${mapCompletion.toFixed (2)}%`; // arrondis la complétion
              if (mapCompletion === '100.00%' && recentData[0].rank !== 'F') {
                // affiche si c'est un pass au lieu du %
                mapCompletion = 'Passed!';
              }

              let scoreAccuracy = (recentData[0].accuracy * 100).toFixed (2);

              let rankingIcon = 'noRank'; // traduit le rank obtenu en icône à afficher
              var embedColor;
              switch (recentData[0].rank) {
                case 'A':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131770419970069/Ranking-A2x.png`;
                  embedColor = '#13ae58';
                  break;
                case 'B':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131771619672095/Ranking-B2x.png`;
                  embedColor = '#136fc4';
                  break;
                case 'C':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131773893115934/Ranking-C2x.png`;
                  embedColor = '#6a14bc';
                  break;
                case 'D':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131768511692810/Ranking-D2x.png`;
                  embedColor = '#a91313';
                  break;
                case 'S':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131769610731520/Ranking-S2x.png`;
                  embedColor = '#bc8c13';
                  break;
                case 'SH':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131824178495528/ranking-SH2x.png`;
                  embedColor = '#9a9a9a';
                  break;
                case 'X':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131826342756423/Ranking-X2x.png`;
                  embedColor = '#bc8c13';
                  break;
                case 'XH':
                  rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131827466829874/ranking-XH2x.png`;
                  embedColor = '#9a9a9a';
                  break;
                default:
                  (rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706551337332244480/deaddeathgravegraveyardhalloweenscaryicon-1320183477745266883.png`), (embedColor =
                    '#f51007');
              }
              // console.log(recentData[0].mods)

              let enabledMods = recentData[0].mods.join ('');
              if (enabledMods === '') {
                enabledMods = 'NM';
              }
              enabledMods = enabledMods.replace ('None', 'NM');
              enabledMods = enabledMods.replace ('NoFail', 'NF');
              enabledMods = enabledMods.replace ('Easy', 'EZ');
              enabledMods = enabledMods.replace ('TouchDevice', 'TD');
              enabledMods = enabledMods.replace ('Hidden', 'HD');
              enabledMods = enabledMods.replace ('HardRock', 'HR');
              enabledMods = enabledMods.replace ('SuddenDeath', 'SD');
              enabledMods = enabledMods.replace ('DoubleTime', 'DT');
              enabledMods = enabledMods.replace ('Relax', 'RX');
              enabledMods = enabledMods.replace ('HalfTime', 'HT');
              enabledMods = enabledMods.replace ('Nightcore', 'NC');
              enabledMods = enabledMods.replace ('Flashlight', 'FL');
              enabledMods = enabledMods.replace ('Autoplay', 'Auto');
              enabledMods = enabledMods.replace ('SpunOut', 'SO');
              enabledMods = enabledMods.replace ('Relax2', 'AP');
              enabledMods = enabledMods.replace ('Perfect', 'PF');
              enabledMods = enabledMods.replace ('Key4', '4K');
              enabledMods = enabledMods.replace ('Key5', '5K');
              enabledMods = enabledMods.replace ('Key6', '6K');
              enabledMods = enabledMods.replace ('Key7', '7K');
              enabledMods = enabledMods.replace ('Key8', '8K');
              enabledMods = enabledMods.replace ('FreeModAllowed', '');
              enabledMods = enabledMods.replace ('ScoreIncreaseMods', '');

              let raw_bpm = recentData[0]._beatmap.bpm;
              let raw_length = recentData[0]._beatmap['length'].total;
              if (enabledMods.includes ('DT' || 'NC')) {
                raw_length /= 1.5;
                raw_length = raw_length.toFixed ();
                raw_bpm *= 1.5;
                raw_bpm = raw_bpm.toFixed ();
              }

              let minuteLength = parseFloat (raw_length / 60); // sépare la length en deux variables, les secondes et les minutes
              minuteLength = Math.trunc (minuteLength);
              let secondLength = `:${raw_length - minuteLength * 60}`;
              secondLength = secondLength.toString ();
              if (secondLength === ':0') {
                secondLength = secondLength.replace (':0', ':00');
              }

              let approvalDate = recentData[0]._beatmap.raw_approvedDate.slice (
                0,
                7
              );
              let scoreDate = recentData[0].raw_date.slice (5, 16);
              let minuteScore = scoreDate.slice (8, 11);
              let hourScore = (parseFloat (scoreDate.slice (6, 8)) +
                config.UTCincrement).toString ();
              scoreDate = scoreDate.slice (0, 6);
              let scoreTime = hourScore + minuteScore;
              scoreDate = scoreDate + scoreTime;
              let playerRank = userData.pp.rank;
              switch (true) {
                case playerRank >= 1000 && playerRank < 10000:
                  playerRank1 = playerRank.toString ().slice (0, 1);
                  playerRank2 = playerRank.toString ().slice (1, 5);
                  playerRank = [playerRank1, playerRank2].join (',');
                  break;
                case playerRank >= 10000 && playerRank < 100000:
                  playerRank1 = playerRank.toString ().slice (0, 2);
                  playerRank2 = playerRank.toString ().slice (2, 6);
                  playerRank = [playerRank1, playerRank2].join (',');
                  break;
                case playerRank >= 100000 && playerRank < 1000000:
                  playerRank1 = playerRank.toString ().slice (0, 3);
                  playerRank2 = playerRank.toString ().slice (3, 7);
                  playerRank = [playerRank1, playerRank2].join (',');
                  break;
                case playerRank >= 1000000 && playerRank < 10000000:
                  playerRank1 = playerRank.toString ().slice (0, 3);
                  playerRank2 = playerRank.toString ().slice (3, 6);
                  playerRank3 = playerRank.toString ().slice (6, 8);
                  playerRank = [playerRank1, playerRank2, playerRank3].join (
                    ','
                  );
                  break;
              }

              execOjsama (
                `curl https://osu.ppy.sh/osu/${recentData[0]._beatmap.id} | node ojsama.js +${enabledMods} ${scoreAccuracy}% ${recentData[0].maxCombo}x ${countMiss}m`,
                async function (error, stdout, stderr) {
                  const ojsamaData = stdout;
                  const formattedOJData = ojsamaData.split ('\n');
                  srData = formattedOJData[6].split (' ');
                  if (srData[0].startsWith ('+')) {
                    srData = formattedOJData[7].split (' ');
                    srData = srData[0];
                    pprecentData = formattedOJData[10].split (' ');
                    pprecentData = parseFloat (pprecentData[0]).toFixed ();
                    pprecentData = pprecentData.toString ();
                  } else {
                    srData = srData[0];
                    pprecentData = formattedOJData[9].split (' ');
                    pprecentData = parseFloat (pprecentData[0]).toFixed ();
                    pprecentData = pprecentData.toString ();
                  }

                  // console.log(formattedOJData);

                  execOjsama (
                    `curl https://osu.ppy.sh/osu/${recentData[0]._beatmap.id} | node ojsama.js +${enabledMods} ${scoreAccuracy}%`,
                    async function (error, stdout, stderr) {
                      const ojsamaData2 = stdout;
                      const formattedOJData2 = ojsamaData2.split ('\n');
                      srData2 = formattedOJData2[6].split (' ');
                      if (srData2[0].startsWith ('+')) {
                        srData2 = formattedOJData2[7].split (' ');
                        srData2 = srData2[0];
                        ppFCData = formattedOJData2[10].split (' ');
                        ppFCData = parseFloat (ppFCData[0]).toFixed ();
                        ppFCData = ppFCData.toString ();
                      } else {
                        srData2 = srData2[0];
                        ppFCData = formattedOJData2[9].split (' ');
                        ppFCData = parseFloat (ppFCData[0]).toFixed ();
                        ppFCData = ppFCData.toString ();
                      }

                      //  console.log(`PP for FC: ${ppFCData}`);
                      execOjsama (
                        `curl https://osu.ppy.sh/osu/${recentData[0]._beatmap.id} | node ojsama.js +${enabledMods}`,
                        async function (error, stdout, stderr) {
                          const ojsamaData3 = stdout;
                          const formattedOJData3 = ojsamaData3.split ('\n');
                          srData3 = formattedOJData3[6].split (' ');
                          if (srData3[0].startsWith ('+')) {
                            srData3 = formattedOJData3[7].split (' ');
                            srData3 = srData3[0];
                            ppSSData = formattedOJData3[10].split (' ');
                            ppSSData = parseFloat (ppSSData[0]).toFixed ();
                            ppSSData = ppSSData.toString ();
                          } else {
                            srData3 = srData3[0];
                            ppSSData = formattedOJData3[9].split (' ');
                            ppSSData = parseFloat (ppSSData[0]).toFixed ();
                            ppSSData = ppSSData.toString ();
                          }
                          //  console.log(`PP for SS: ${ppSSData}`);

                          let ppEmbed;
                          if (
                            recentData[0].maxCombo >=
                            recentData[0]._beatmap.maxCombo - 10
                          ) {
                            ppEmbed = `**${ppSSData}pp if SS**`;
                          } else ppEmbed = `**${ppFCData}pp if FC**`;

                          // console.log(recentData[0]._beatmap)

                          let embed = new MessageEmbed ()
                            .setColor (embedColor)
                            .setTitle (
                              `${recentData[0]._beatmap.artist} - ${recentData[0]._beatmap.title} [${recentData[0]._beatmap.version}] +${enabledMods}`
                            )
                            .setImage (
                              `https://assets.ppy.sh/beatmaps/${recentData[0]._beatmap.beatmapSetId}/covers/cover.jpg?1547927639`
                            )
                            .setThumbnail (rankingIcon)
                            .setURL (
                              `https://osu.ppy.sh/beatmapsets/${recentData[0]._beatmap.beatmapSetId}#osu/${recentData[0]._beatmap.id}`
                            )
                            .setFooter (
                              `${scoreDate} | ${recentData[0]._beatmap.creator} | ${recentData[0]._beatmap.approvalStatus} (${approvalDate}) | ${srData}★ | ${minuteLength}${secondLength} | ${raw_bpm}BPM`
                            )
                            .setAuthor (
                              `Most recent score of ${userData.name} (#${playerRank})`,
                              `https://a.ppy.sh/${userData.id}?1569169881.png`,
                              `https://osu.ppy.sh/users/${userData.id}`
                            )
                            .addFields (
                              {
                                name: '**Completion:**',
                                value: `**🠶 ${mapCompletion}\n 🠶 ${recentData[0].maxCombo} / ${recentData[0]._beatmap.maxCombo}**`,
                                inline: true,
                              },
                              {
                                name: '**Accuracy:**',
                                value: `**🠶 ${scoreAccuracy}%\n 🠶 ${count100} / ${count50} / ${countMiss}xMiss**`,
                                inline: true,
                              },
                              {
                                name: '**Performance:**',
                                value: `**🠶 ${pprecentData}pp**\n🠶 ${ppEmbed}`,
                                inline: true,
                              }
                            );
                          msg.delete (); // delete le message de chargement
                          message.channel.send (embed); // envoi du score
                        }
                      );
                    }
                  );
                }
              );
            });
        });
    } catch (error) {
      console.log (error);
      msg.delete ();
      message.reply (
        "une erreur est survenue, c'est pas normal faut le dire à Oxy!!!!"
      );
      message.channel.send (`\`${error.name} : ${error.message}\``);
    }
  },
};
