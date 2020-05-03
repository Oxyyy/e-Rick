const { MessageEmbed } = require('discord.js');
const { blue } = require('../colours.json');
const fetch = require('node-fetch');
const Nodesu = require('nodesu');
const config = require('../config.json');
const api = new Nodesu.Client(config.osuToken);


module.exports = {
    name: 'osu',
    description: 'Answers with the osu! profile details of the corresponding user',
    args: true,
    usage: '<joueur> <mode> (0=std|1=taiko|2=ctb|3=mania, default is std)',
    aliases: ['profile', 'o'],
    cooldown: 5,

    async execute(message, args) {
        let msg = await message.channel.send('Chargement des données...')
        var mode = 0
        if (args.length === 2) {
            mode = args[1];
        }
        try {
            api
                .user.get(args[0], Nodesu.mode = mode)
                .then(async userInfo => {
                    if (userInfo === undefined) return message.reply('joueur invalide!'), msg.delete()
                    var playtime = Math.round(userInfo.total_seconds_played / 3600)
                    var accuracy = parseFloat(userInfo.accuracy)
                    accuracy = accuracy.toFixed(2)
                    var pp = Math.round(userInfo.pp_raw)
                    var username = userInfo.username

                    let joinDate = userInfo.join_date.slice(0, 10)

                    let embed = new MessageEmbed()
                        .setColor(blue)
                        .setTitle(`${username} :flag_${userInfo.country.toLowerCase()}:`)
                        .addFields(
                            { name: `Global rank:`, value: `${userInfo.pp_rank}`, inline: true },
                            { name: `Country rank:`, value: `${userInfo.pp_country_rank}`, inline: true },
                            { name: `Global accuracy:`, value: `${accuracy}%`, inline: true },
                            { name: `Performance:`, value: `${pp}pp`, inline: true },
                            { name: `Playtime:`, value: `${playtime} hours`, inline: true },
                            { name: `Playcount:`, value: `${userInfo.playcount}`, inline: true },
                        )
                        .setThumbnail(`https://a.ppy.sh/${userInfo.user_id}?1585064739.png`)
                        .setFooter(`Joined: ${joinDate} | Level: ${userInfo.level}`)
                        .setURL(`https://osu.ppy.sh/users/${userInfo.user_id}`)

                    msg.edit('‎')
                    msg.edit(embed)
                })
        }
        catch (error) {
            msg.delete()
            message.reply('une erreur est survenue, c\'est pas normal faut le dire à Oxy!!!!')
            message.channel.send(`\`${error.name} : ${error.message}\``)
        }
    }
}