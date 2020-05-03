const { MessageEmbed } = require('discord.js')
const { blue } = require('../colours.json')
const fetch = require('node-fetch');

module.exports = {
    name: 'meme',
    description: 'Answers with a random meme.',
    cooldown: 15,
    async execute(message, args) {
        let msg = await message.channel.send('Génération en cours...')

        fetch('https://apis.duncte123.me/meme')
            .then(res => res.json()).then(body => {
                if (!body) return message.reply('Erreur, l\'API est inaccessible, essayez encore!'), msg.delete()
                
                let embed = new MessageEmbed()
                .setTitle(body.data.title)
                .setImage(body.data.image)
                .setColor(blue)
                .setTimestamp()
                .setFooter(body.data.url)
                        msg.edit('‎')
                        msg.edit(embed)
            })

    },
};