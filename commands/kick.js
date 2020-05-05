const config = require('../config.json')
module.exports = {
    name: 'kick',
    description: 'Kick a user from the server.',
    guildOnly: true,
    args: true,
    admin: true,
    usage: '@<utilisateur>',
    async execute(message, args) {
      try {
        const member = message.mentions.members.first();
        if (member.user.id === config.masterID) return message.reply('on ne kick pas Oxy!!!!')
        let msg = await message.channel.send (
            `:warning: \`${member.user.tag} va être expulsé dans 3 secondes.\``
          );
          setTimeout (async function () {
            await msg.edit (`:warning: \`${member.user.tag} va être expulsé dans 2 secondes..\``);
          }, 1000);
          setTimeout (async function () {
            await msg.edit (`:warning: \`${member.user.tag} va être expulsé dans 1 secondes...\``);
          }, 2000);
          setTimeout (async function () {
            member.send('vous avez été expulsé')
            await msg.edit (`:sunglasses: \`${member.user.tag} a été expulsé!\``);
            member.kick();
          }, 3000);
      }
      catch(e) {
        message.reply('bruh')
      }      
    },
};