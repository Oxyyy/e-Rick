const { MessageEmbed } = require('discord.js');
const { blue } = require('../colours.json');
const fetch = require('node-fetch');
const Nodesu = require('nodesu');
const config = require('../config.json');
const api = new Nodesu.Client(config.osuToken);


module.exports = {
    name: 'beatmap',
    description: 'Answers with the details of the corresponding osu! beatmap',
    args: true,
    usage: '<beatmap id>',
    aliases: ['map', 'm'],
    cooldown: 10,

    async execute(message, args) {
        let msg = await message.channel.send('Chargement des données...')
        try {
            api
                .beatmaps.getByBeatmapId(args[0])
                .then(async beatmapInfo => {
                    if (beatmapInfo[0] === undefined) return message.reply('beatmap invalide!'), msg.delete() // anti-débiles

                    let mode = beatmapInfo[0].mode // traduit l'id du mode en string (pour pouvoir créer l'url de l'hyperlink)
                    switch (mode) {
                        case '0':
                            mode = 'osu'
                            break;
                        case '1':
                            mode = 'taiko'
                            break;
                        case '2':
                            mode = 'fruits'
                            break;
                        case '3':
                            mode = 'mania'
                            break;
                    }

                    let minuteLength = parseFloat(beatmapInfo[0].total_length / 60) // sépare la length en deux variables, les secondes et les minutes
                    minuteLength = Math.trunc(minuteLength)
                    let secondLength = beatmapInfo[0].total_length - minuteLength * 60

                    let diffSR = parseFloat(beatmapInfo[0].difficultyrating) // arrondis le SR
                    diffSR = diffSR.toFixed(2)

                    let passRate = (beatmapInfo[0].passcount / beatmapInfo[0].playcount) * 100 // calcule le passRate avec le passCount et le playCount
                    passRate = passRate.toFixed(2)

                    let playCount = parseFloat(beatmapInfo[0].playcount) // formattage des décimales et de l'unité du playcount 
                    let decimalSymbol = '‎'
                    if (playCount >= 1000 && playCount < 1000000) {
                        playCount = playCount / 1000
                        playCount = playCount.toFixed()
                        decimalSymbol = 'k'
                    }
                    else if (playCount >= 1000000) {
                        playCount = playCount / 1000000
                        playCount = playCount.toFixed()
                        decimalSymbol = 'M'
                    }
                    else if (playCount === 0) {
                        playCount = 'NaN'
                    }

                    let dateSubmitted = beatmapInfo[0].submit_date // coupe la date pour enlever l'heure car inutile
                    dateSubmitted = dateSubmitted.slice(0, 10)

                    switch (beatmapInfo[0].approved) { // traduit l'id du statut de la map en string
                        case '-2':
                            mapStatus = "Graveyarded";
                            break;
                        case '-1':
                            mapStatus = "WIP";
                            break;
                        case '0':
                            mapStatus = "Pending";
                            break;
                        case '1':
                            mapStatus = "Ranked";
                            break;
                        case '2':
                            mapStatus = "Approved";
                            break;
                        case '3':
                            mapStatus = "Qualified";
                            break;
                        case '4':
                            mapStatus = "Loved";
                    }

                    let embed = new MessageEmbed() // embed posté par le bot
                        .setColor(blue)
                        .setTitle(`${beatmapInfo[0].artist} - ${beatmapInfo[0].title} (${beatmapInfo[0].version})`)
                        .setImage(`https://assets.ppy.sh/beatmaps/${beatmapInfo[0].beatmapset_id}/covers/cover.jpg?1547927639`)
                        .setFooter(`Favorites: ${beatmapInfo[0].favourite_count} | Playcount: ${playCount}${decimalSymbol} | Pass rate: ${passRate}%`)
                        .setURL(`https://osu.ppy.sh/beatmapsets/${beatmapInfo[0].beatmapset_id}#${mode}/${beatmapInfo[0].beatmap_id}`)
                        .addFields(
                            {
                                name: 'Infos', value: `
                        **Status:** ${mapStatus}
                        **Mapper:** ${beatmapInfo[0].creator}
                        **Date submitted:** ${dateSubmitted}
                        `, inline: true
                            },
                            {
                                name: `Stats`, value: `
                        **Length:** ${minuteLength}min${secondLength}s | **BPM:** ${beatmapInfo[0].bpm}
                        **CS:** ${beatmapInfo[0].diff_size} | **HP:** ${beatmapInfo[0].diff_drain} | **OD:** ${beatmapInfo[0].diff_overall} | **AR:** ${beatmapInfo[0].diff_approach}
                        **SR:** ${diffSR}★ | **Max combo:** ${beatmapInfo[0].max_combo}
                        `, inline: true
                            },
                        )
                    msg.edit('‎')
                    msg.edit(embed)
                })

        }
        catch (e) {
            msg.delete()
            message.reply('une erreur est survenue, c\'est pas normal faut le dire à Oxy!!!!')
            message.channel.send(`\`${e.name} : ${e.message}\``)
        }

    }
}