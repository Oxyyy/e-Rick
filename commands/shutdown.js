module.exports = {
  name: 'shutdown',
  description: 'kills the bot',
  admin: true,
  aliases: ['reboot', 'kill', 'stop', 'sd', 'refresh', 'reset'],
  cooldown: 10,
  async execute (message) {
    let msg = await message.channel.send (
      ':warning: `e-Rick va redémarrer dans 3 secondes.`'
    );
    setTimeout (async function () {
      await msg.edit (':warning: `e-Rick va redémarrer dans 2 secondes..`');
    }, 1000);
    setTimeout (async function () {
      await msg.edit (':warning: `e-Rick va redémarrer dans 1 secondes...`');
    }, 2000);
    setTimeout (async function () {
      await msg.edit (':sunglasses: `redémarrage!`');
      return process.exit (22);
    }, 3000);
  },
};
