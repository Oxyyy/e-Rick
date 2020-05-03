const config = require('../config.json');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js')
const { blue } = require('../colours.json')

module.exports = {
    name: 'weather',
    description: 'Answers with the current weather at the corresponding place.',
    args: true,
    usage: '<ville>',
    aliases: ['meteo', 'w'],
    //cooldown: 15,
    async execute(message, args) {
        let city = args.join(" ")
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.weatherApi}&units=metric&lang=fr`)
            .then(async res => res.json())
            .then(async body => {
                if (body.cod !== 200) return message.reply('ville incorrecte!')
                
                try {
                    var windDirection = 'Inconnue'
                    if (body.wind.deg > 340 || body.wind.deg <= 10) {
                        windDirection = 'Nord'
                    }
                    else if (body.wind.deg >= 20 && body.wind.deg <= 30) {
                        windDirection = 'Nord/Nord-Est'
                    }
                    else if (body.wind.deg > 30 && body.wind.deg <= 50) {
                        windDirection = 'Nord-Est'
                    }
                    else if (body.wind.deg > 50 && body.wind.deg <= 70) {
                        windDirection = 'Est/Nord-Est'
                    }
                    else if (body.wind.deg > 70 && body.wind.deg <= 100) {
                        windDirection = 'Est'
                    }
                    else if (body.wind.deg > 100 && body.wind.deg <= 120) {
                        windDirection = 'Est/Sud-Est'
                    }
                    else if (body.wind.deg > 120 && body.wind.deg <= 140) {
                        windDirection = 'Sud-Est'
                    }
                    else if (body.wind.deg > 140 && body.wind.deg <= 160) {
                        windDirection = 'Sud/Sud-Est'
                    }
                    else if (body.wind.deg > 160 && body.wind.deg <= 190) {
                        windDirection = 'Sud'
                    }
                    else if (body.wind.deg > 190 && body.wind.deg <= 210) {
                        windDirection = 'Sud/Sud-Ouest'
                    }
                    else if (body.wind.deg > 210 && body.wind.deg <= 230) {
                        windDirection = 'Sud-Ouest'
                    }
                    else if (body.wind.deg > 230 && body.wind.deg <= 250) {
                        windDirection = 'Ouest/Sud-Ouest'
                    }
                    else if (body.wind.deg > 250 && body.wind.deg <= 280) {
                        windDirection = 'Ouest'
                    }
                    else if (body.wind.deg > 280 && body.wind.deg <= 300) {
                        windDirection = 'Ouest/Nord-Ouest'
                    }
                    else if (body.wind.deg > 300 && body.wind.deg <= 320) {
                        windDirection = 'Nord-Ouest'
                    }
                    else if (body.wind.deg > 320 && body.wind.deg <= 340) {
                        windDirection = 'Nord/Nord-Ouest'
                    }
                    else {
                        windDirection = 'Inconnue'
                    }
                    
                    let msg = await message.channel.send('Chargement des données...')
                    let embed = new MessageEmbed()
                        .setColor(blue)
                        .setThumbnail(`http://openweathermap.org/img/w/${body.weather[0].icon}.png`)
                        .addFields(
                            { name: 'Ville:', value: `${body.name}  :flag_${body.sys.country.toLowerCase()}:\nLongitude: ${body.coord.lon}° (DD)\nLatitude: ${body.coord.lat}° (DD)` },
                            { name: 'Description:', value: `${body.weather[0].description}` },
                            // { name: '\u200B', value: '\u200B' },
                            { name: 'Température:', value: `${body.main.temp}°C (${body.main.feels_like}°C ressentis)`, inline: true },
                            { name: 'Vent:', value: `${body.wind.speed*3.6}km/h (Direction: ${windDirection})`, inline: true },
                        )
                        .setTitle(`Données météorologiques:`)
                        .setTimestamp()
                    msg.edit('‎')
                    msg.edit(embed)

                }
                catch(error) {
                    msg.delete()
                    message.reply('une erreur est survenue, c\'est pas normal faut le dire à Oxy!!!!')
                    message.channel.send(`\`${e.name} : ${e.message}\``)

                }
            })


    },
};