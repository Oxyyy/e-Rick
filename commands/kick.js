const config = require('../config.json')
module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',
    guildOnly: true,
    args: true,
    usage: '@<utilisateur>',
    execute(message, args) {
        const member = message.mentions.members.first();
        if (message.author.id === config.masterID || message.author.id === '202063006291460097') {
            member.kick();
            message.channel.send(member.user.tag + ' a été expulsé!')
            
        }
        else message.channel.send('accès refusé!')


    },
};