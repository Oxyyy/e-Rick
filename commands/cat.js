const { MessageEmbed } = require('discord.js')
const { blue } = require('C:/Users/petit/Desktop/e-Rick/colours.json')
const fetch = require('node-fetch');

module.exports = {
    name: 'cat',
    description: 'Answers with a random cat image.',
    cooldown: 15,
    async execute(message, args) {
        let msg = await message.channel.send('Génération en cours...')

        fetch('http://aws.random.cat/meow')
            .then(res => res.json()).then(body => {
                if (!body) return message.reply('Erreur, l\'API est innaccessible, essayez encore!'), msg.delete()
                
                let embed = new MessageEmbed()
                .setTitle('Super chat! mooooohhh 😻')
                .setImage(body.file)
                .setColor(blue)
                .setTimestamp()
                        msg.edit('‎')
                        msg.edit(embed)
            })

    },
};