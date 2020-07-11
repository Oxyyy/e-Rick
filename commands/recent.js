const { MessageEmbed } = require('discord.js');
const { blue } = require('../colours.json');
const fetch = require('node-fetch');
const config = require('../config.json');
const tigrou = require('node-osu');
const osuApi = new tigrou.Api(config.osuToken, {
	completeScores: true,
	parseNumeric: true,
	notFoundAsError: false
});
const db = require('quick.db');
const moment = require('moment');

const numberFormat = require('../functions/numberFormat.js');
const lengthFormat = require('../functions/lengthFormat.js');
const dateFormat = require('../functions/dateFormat.js');
const modFormat = require('../functions/modFormat.js');
const rankingColor = require('../functions/rankingColor.js');
const rankingIcon = require('../functions/rankingIcon.js');
const osuGetDB = require('../functions/osuGetDB.js')

const osu = require('ojsama');
let execOjsama = require('child_process').exec;

module.exports = {
	name: 'recent',
	description: 'Answers with details about the most recent score of a player',
	args: false,
	channelLimit: '702628237791985674',
	debug: false,
	usage: '<joueur|ID>',
	aliases: [ 'rs' ],
	cooldown: 0,

	async execute(message, args, fb) {
		try {
			let userID;
			if (!args.length) {
				userID = await osuGetDB.execute(fb, message);
				if (!userID)
					return message.reply("vous devez link votre compte osu, plus d'infos avec `;help osulink`");
			} else userID = args.join('_'); // else define the player as the first argument

			let msg = await message.channel.send(`\`Récupération des données.\``); // loading message
			setTimeout(async function() {
				await msg.edit(`\`Récupération des données..\``);
			}, 1000);
			setTimeout(async function() {
				await msg.edit(`\`Récupération des données...\``);
			}, 2000);

			let argMode = 'osu';
			if (args.length > 1) {
				// flemme de faire les autres modes mdr
				switch (args[1]) {
					case 'mania':
						argMode = 'mania';
						return message.reply("ce mini-jeu n'est pas encore supporté!"), msg.delete();
						break;
					case 'taiko':
						argMode = 'taiko';
						return message.reply("ce mini-jeu n'est pas encore supporté!"), msg.delete();
						break;
					case 'ctb':
						argMode = 'fruits';
						return message.reply("ce mini-jeu n'est pas encore supporté!"), msg.delete();
						break;
					default:
						return message.reply('argument invalide!'), msg.delete();
				}
			}

			const recentData = osuApi.getUserRecent({ u: userID }).then((recentData) => {
				if (recentData[0] === undefined)
					// checking recent scores for the player
					return message.reply("ce joueur n'a pas joué ces dernières 24h!"), msg.delete();
				const userData = osuApi.getUser({ u: recentData[0].user.id }).then((userData) => {
					let count50 = recentData[0].counts['50']; // pr faire plus lisible
					let count100 = recentData[0].counts['100']; // pr faire plus lisible
					let countMiss = recentData[0].counts['miss']; // pr faire plus lisible
					let totalHit = count50 + count100 + recentData[0].counts['300'] + countMiss; // calcule le total des objets hit par le joueur
					let totalObjects =
						recentData[0]._beatmap.objects['normal'] +
						recentData[0]._beatmap.objects['slider'] +
						recentData[0]._beatmap.objects['spinner']; // calcule le total des objets de la map
					let mapCompletion = totalHit / totalObjects * 100; // calcule la complétion
					mapCompletion = `${mapCompletion.toFixed(2)}%`; // arrondis la complétion
					if (mapCompletion === '100.00%' && recentData[0].rank !== 'F') {
						// affiche si c'est un pass au lieu du %
						mapCompletion = 'Passed!';
					}

					let scoreAccuracy = (recentData[0].accuracy * 100).toFixed(2);

					let rankObtained = recentData[0].rank; // parse the obtained rank
					let rankingIco = rankingIcon.execute(rankObtained); // retrieve the ranking icon using a custom function
					let rankingColo = rankingColor.execute(rankObtained); // retrieve the embed's color using a custom function

					let enabledMods = recentData[0].mods.join(''); // mods formatting using a custom function
					let formattedMods = modFormat.execute(enabledMods);

					let raw_bpm = recentData[0]._beatmap.bpm;
					raw_bpm = raw_bpm.toFixed(); // rounding bpm
					let rawLength = recentData[0]._beatmap['length'].total;
					if (formattedMods.includes('DT' || 'NC')) {
						// edit bpm/length if DT/NC
						rawLength /= 1.5;
						rawLength = rawLength.toFixed();
						raw_bpm *= 1.5;
						raw_bpm = raw_bpm.toFixed();
					}

					let formattedLength = lengthFormat.execute(rawLength); // length formatting using a custom function

					let rawNumber = userData.pp.rank; // rank formatting using a custom function
					formattedRank = numberFormat.execute(rawNumber);

					execOjsama(
						`curl https://osu.ppy.sh/osu/${recentData[0]._beatmap
							.id} | node ojsama.js +${formattedMods} ${scoreAccuracy}% ${recentData[0]
							.maxCombo}x ${countMiss}m`, // parse actual score performance
						async function(error, stdout, stderr) {
							const ojsamaData = stdout;
							const formattedOJData = ojsamaData.split('\n');
							srData = formattedOJData[6].split(' ');
							if (srData[0].startsWith('+')) {
								srData = formattedOJData[7].split(' ');
								srData = srData[0];
								pprecentData = formattedOJData[10].split(' ');
								pprecentData = parseFloat(pprecentData[0]).toFixed();
								pprecentData = pprecentData.toString();
							} else {
								srData = srData[0];
								pprecentData = formattedOJData[9].split(' ');
								pprecentData = parseFloat(pprecentData[0]).toFixed();
								pprecentData = pprecentData.toString();
							}

							execOjsama(
								`curl https://osu.ppy.sh/osu/${recentData[0]._beatmap
									.id} | node ojsama.js +${formattedMods} ${scoreAccuracy}%`, // parse score performance if FC
								async function(error, stdout, stderr) {
									const ojsamaData2 = stdout;
									const formattedOJData2 = ojsamaData2.split('\n');
									srData2 = formattedOJData2[6].split(' ');
									if (srData2[0].startsWith('+')) {
										srData2 = formattedOJData2[7].split(' ');
										srData2 = srData2[0];
										ppFCData = formattedOJData2[10].split(' ');
										ppFCData = parseFloat(ppFCData[0]).toFixed();
										ppFCData = ppFCData.toString();
									} else {
										srData2 = srData2[0];
										ppFCData = formattedOJData2[9].split(' ');
										ppFCData = parseFloat(ppFCData[0]).toFixed();
										ppFCData = ppFCData.toString();
									}

									execOjsama(
										`curl https://osu.ppy.sh/osu/${recentData[0]._beatmap
											.id} | node ojsama.js +${formattedMods}`, // parse score performance if SS
										async function(error, stdout, stderr) {
											const ojsamaData3 = stdout;
											const formattedOJData3 = ojsamaData3.split('\n');
											srData3 = formattedOJData3[6].split(' ');
											if (srData3[0].startsWith('+')) {
												srData3 = formattedOJData3[7].split(' ');
												srData3 = srData3[0];
												ppSSData = formattedOJData3[10].split(' ');
												ppSSData = parseFloat(ppSSData[0]).toFixed();
												ppSSData = ppSSData.toString();
											} else {
												srData3 = srData3[0];
												ppSSData = formattedOJData3[9].split(' ');
												ppSSData = parseFloat(ppSSData[0]).toFixed();
												ppSSData = ppSSData.toString();
											}

											let ppEmbed; // detect if it's an fc
											if (recentData[0].maxCombo >= recentData[0]._beatmap.maxCombo - 10) {
												ppEmbed = `**${ppSSData}pp if SS**`;
											} else ppEmbed = `**${ppFCData}pp if FC**`;

											let raw_date1 = recentData[0].raw_date;

											let timeAgo1 = moment(raw_date1, 'YYYY-MM-DD HH:mm:SS').fromNow();

											let approvalDate = recentData[0]._beatmap.raw_approvedDate;
											approvalDate = moment(approvalDate, 'YYYY-MM-DD HH:mm:SS').fromNow();

											let embed = new MessageEmbed() // setting up the final embed
												.setColor(rankingColo)
												.setTitle(
													`${recentData[0]._beatmap.artist} - ${recentData[0]._beatmap
														.title} [${recentData[0]._beatmap
														.version}] +${formattedMods} (${srData}★)`
												)
												.setImage(
													`https://assets.ppy.sh/beatmaps/${recentData[0]._beatmap
														.beatmapSetId}/covers/cover.jpg?1547927639`
												)
												.setThumbnail(rankingIco)
												.setURL(
													`https://osu.ppy.sh/beatmapsets/${recentData[0]._beatmap
														.beatmapSetId}#osu/${recentData[0]._beatmap.id}`
												)
												.setFooter(
													`Set ${timeAgo1} | ${recentData[0]._beatmap
														.creator} | ${recentData[0]._beatmap
														.approvalStatus} ${approvalDate} | ${formattedLength} | ${raw_bpm}BPM`
												)
												.setAuthor(
													`Most recent score of ${userData.name} (#${formattedRank})`,
													`https://a.ppy.sh/${userData.id}?1569169881.png`,
													`https://osu.ppy.sh/users/${userData.id}`
												)
												.addFields(
													{
														name: '**Completion:**',
														value: `**🠶 ${mapCompletion}\n 🠶 ${recentData[0]
															.maxCombo} / ${recentData[0]._beatmap.maxCombo}**`,
														inline: true
													},
													{
														name: '**Accuracy:**',
														value: `**🠶 ${scoreAccuracy}%\n 🠶 ${count100} / ${count50} / ${countMiss}m**`,
														inline: true
													},
													{
														name: '**Performance:**',
														value: `**🠶 ${pprecentData}pp**\n🠶 ${ppEmbed}`,
														inline: true
													}
												);
											msg.delete(); // delete le message de chargement
											fb.collection('guilds').doc(message.guild.id).update({
												recentMap: recentData[0]._beatmap.id
											})
												
											message.channel.send(embed); // envoi du score
										}
									);
								}
							);
						}
					);
				});
			});
		} catch (error) {
			console.log(error);
			message.reply("une erreur est survenue, c'est pas normal faut le dire à Oxy!!!!");
			message.channel.send(`\`${error.name} : ${error.message}\``);
		}
	}
};
