const osu = require("node-osu")
const config = require('../config.json')

const osuApi = new osu.Api(config.osuToken, {
  parseNumeric: true, // Parse numeric values into numbers/floats, excluding ids
  notFoundAsError: false,
  completeScores: true,
});

module.exports = {
    name: 'osulinkedit',
    aliases: ['ole'],
    admin: true,

    async execute(message, args, fb) {
        let discordID = args[0]
        let osuID = args[1]

        let osuInfos = await osuApi.getUser({ u: osuID }).then(user => {
            return {
              name: user.name,
              ID: user.id
            }
        });

        fb.collection('osuAccounts').doc(discordID).set({
            osuID: osuInfos.ID,
            osuName: osuInfos.name
        })

        message.channel.send(`osuAccount db updated:\n\`discordID: ${discordID} | osuID: ${osuInfos.ID} | osuName: ${osuInfos.name}\``)

    }
}