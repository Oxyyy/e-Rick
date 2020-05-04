const config = require('../config.json')
module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',
    guildOnly: true,
    args: true,
    admin: true,
    usage: '@<utilisateur>',
    execute(message, args) {
        const member = message.mentions.members.first();
        member.kick();
        message.channel.send(member.user.tag + ' a été expulsé!')
    },
};