const { MessageEmbed } = require('discord.js');
const { blue } = require('../colours.json');
const fetch = require('node-fetch');

module.exports = {
    name: 'define',
    description: 'Answers with the definition of the corresponding argument.',
    args: true,
    usage: '<mot>',
    aliases: ['def','search'],
    cooldown: 20,

    async execute(message, args) {
        let term = args.join(" ")
        fetch(`http://api.urbandictionary.com/v0/define?term=${term}`)
            .then(async res => await res.json())
            .then(async body => {
                let msg = await message.channel.send('Recherche en cours...');
                try {
                    if (!body) return message.reply('Erreur, l\'API est inaccessible, essayez encore!')
                    if (!body.list[0]) return message.reply(`aucun résultat trouvé pour "${args[0]}"!`), msg.delete();

                    let formattedDefinition = body.list[0].definition
                    formattedDefinition = formattedDefinition.toString()
                    formattedDefinition = formattedDefinition.replace(/\[/g, '');
                    formattedDefinition = formattedDefinition.replace(/\]/g, '');

                    let embed = new MessageEmbed()
                        .setColor(blue)
                        .setTitle(`Définition de "${body.list[0].word}"`)
                        .setDescription(formattedDefinition)
                        .setTimestamp()
                    msg.edit('‎')
                    msg.edit(embed)
                }
                catch (error) {
                    msg.delete()
                    message.reply('une erreur est survenue, c\'est pas normal faut le dire à Oxy!!!!')
                    message.channel.send(`\`${e.name} : ${e.message}\``)
                    
                }
            }

            )
    }
}