const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { blue } = require('../colours.json')

module.exports = {
    name: 'rsbs',
    description: 'rs pour mirthille (beatsaber)',
    cooldown: 5,
    channelLimit: '702628237791985674',
    async execute(message) {
        const data = await fetch(`https://new.scoresaber.com/api/player/76561198065389085/scores/recent`)
        .then(res => res.json())
        // console.log(data.scores[0])
        let dataParsed = data.scores[0].toString()   
        let scoreAccuracy = parseFloat((data.scores[0].score/data.scores[0].maxScoreEx)*100)
        scoreAccuracy = scoreAccuracy.toFixed(2)
        let mapDiff = data.scores[0].diff.replace('SoloStandard','')
        mapDiff = mapDiff.replace(/_/g,'')
        let boardID = parseInt(data.scores[0].leaderboardId)
        let mapURL = `https://scoresaber.com/leaderboard/${boardID}`
        let ppWeighted = data.scores[0].weight*data.scores[0].pp
        ppWeighted = ppWeighted.toFixed()
        let dateFormatted = data.scores[0].timeset
        dateFormatted = dateFormatted.replace('T', ' ')
        dateFormatted = dateFormatted.replace('Z', ' ')
        dateFormatted = dateFormatted.replace('.000', ' ')


        message.channel.send('**Most recent Beat Saber score for Mirthille:**')
        let embed = new MessageEmbed()
        .setColor(blue)
        .setTitle(`${data.scores[0].songAuthorName} - ${data.scores[0].name} [${mapDiff}]`)
        .setImage(`https://scoresaber.com/imports/images/songs/${data.scores[0].id}.png`)
        .setFooter(`Played: ${dateFormatted}`)
        .setURL(mapURL)
        .addFields(
            {
                name: 'Performance:', value: `${data.scores[0].pp.toFixed()}pp (Weighted: ${ppWeighted}pp)`, inline:true
            },
            {
                name: 'Accuracy', value: `${scoreAccuracy}%`, inline:true
            }
        )

        message.channel.send(embed)


        


    }
}