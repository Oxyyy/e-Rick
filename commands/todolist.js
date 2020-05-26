const Discord = require("discord.js");
const fs = require('fs')
const { blue } = require('../colours.json')

module.exports = {
    name: "todolist",
    aliases: ["tdl"],

    async execute(message, args) {
        var channelFetch = fs.readFileSync("./txt/todolist.txt", "utf8");
        formattedList = channelFetch.split("|")
        let embed = new Discord.MessageEmbed()

        .setColor(blue)
        .setAuthor('To-do list de e-Rick');

        formattedList.forEach(element => {
            embed.addField(`${formattedList.indexOf(element)+1}.`, `${element}`)           
        });
        message.channel.send(embed)
    }
}