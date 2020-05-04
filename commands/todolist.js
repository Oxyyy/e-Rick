const tdl = require('quick.db');
const { MessageEmbed } = require("discord.js");
const { blue } = require('../colours.json')


module.exports = {
    name: 'todolist',
    description: 'lists the upcoming features of the bot',
    aliases: ['tdl'],
    args: false,

    async execute(message, args) {
        toDoList = tdl.get('tdl')
        toDoList = (Object.values(toDoList)).toString()
        toDoList = toDoList.replace(/, /g, '\n- ')
        let embed = new MessageEmbed()
        .setColor(blue)
        .setDescription(`\`\`\`${toDoList}\`\`\``)
        .setThumbnail('https://cdn.discordapp.com/attachments/612312867139616769/706918007628365844/1024px-Icon-notepad.png')
        message.channel.send(embed)
        




    }
}