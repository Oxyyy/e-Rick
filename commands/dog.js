const { MessageEmbed } = require('discord.js')
const { blue } = require('../colours.json')
const fetch = require('node-fetch');

module.exports = {
    name: 'dog',
    description: 'Answers with a random dog image.',
    cooldown: 15,
    async execute(message, args) {
        let msg = await message.channel.send('Génération en cours...')

        fetch('https://dog.ceo/api/breeds/image/random')
            .then(res => res.json()).then(body => {
                if (!body) return message.reply('Erreur, l\'API est inaccessible, essayez encore!'), msg.delete()
                
                let embed = new MessageEmbed()
                .setTitle('Super chien! 🐕')
                .setImage(body.message)
                .setColor(blue)
                .setTimestamp()
                        msg.edit('‎')
                        msg.edit(embed)
            })

    },
};