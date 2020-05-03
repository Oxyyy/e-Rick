const { MessageEmbed } = require('discord.js')
const { blue } = require('C:/Users/petit/Desktop/e-Rick/colours.json')
const fetch = require('node-fetch');

module.exports = {
    name: 'wiki',
    description: 'Answers with the first Wikipedia definition of the argument',
    aliases: ['wikipedia', 'article', 'halgoh'],
    usage: '<terme>',
    cooldown: 5,
    async execute(message, args) {
        let term = args.join('_')
        let msg = await message.channel.send('Recherche en cours...')
        try{
            const article = await fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${term}`)
            .then(res => res.json())
                // console.log(article)

                let embed = new MessageEmbed()
                .setColor(blue)
                .setTitle(article.title)
                .setURL(article.content_urls.desktop.page)
                .setThumbnail((article.thumbnail && article.thumbnail.source) || 'https://gameosu.s-ul.eu/98QUhjz0')
                .setDescription(article.extract)
                .setTimestamp()

                msg.delete()
                message.channel.send(embed)
            

        }
        catch(error)    {
            // console.log(error)
            msg.delete()
            message.reply('je sais pas! (il faut pas que le titre contienne d\'accents si ça peut aider)')
            //message.channel.send(`\`${error.name} : ${error.message}\``)
        }
        

    },
};