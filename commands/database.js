let tdl = require ('quick.db');
let tdlCountValue = require ('quick.db');

module.exports = {
  name: 'database',
  description: "allows to edit e-rick's database",
  aliases: ['db'],
  args: true,
  wip: false,
  admin: true,
  usage: '<-show *object to show* or -all to return all of the db (in the console)> / <-add *object to add in the todolist*> / <-reset *object to delete from the db*>',
  cooldown: 5,
  async execute (message, args) {
    if (!tdlCountValue.get ('value')) {
      tdlCountValue.set ('value', {count: 1});
    }
    if (args[0] === '-show') {
      try {
        switch (true) {
          case args[1] === '-all':
            try {
              console.log(`Full database: ${(tdl.all())}`);
            }
            catch(e) {
              message.channel.send('length error')
            }
            break;
          default: {
            let showedValue = (Object.values (tdl.get (args[1].toString ()))).toString()
            showedValue = showedValue.replace(/,/g, '')
            message.channel.send (
              `\`${showedValue}\``
            );
          }
        }
      } catch (e) {
        // console.log(e)
        message.reply (`Invalid argument`);
      }
    } else if (args[0] === '-edit') {
      try {
        let argsFormatted2 = args.join (' ');
        argsFormatted2 = argsFormatted2.toString ();
        argsFormatted2 = argsFormatted2.replace (`-edit ${args[1]} `, '');
        argsFormatted2 = argsFormatted2.replace(/,/g, '')
        tdl.set(`${args[1].toString()}`, argsFormatted2)
      } catch (e) {
        // console.log(e)
        message.reply (`Invalid argument`);
      }
    } else if (args[0] === '-reset') {
      tdl.delete (args[1].toString ());
    } else if (args[0] === '-add') {
      try {
        let argsFormatted = args.join (' ');
        argsFormatted = argsFormatted.replace ('-add', '');
        argsFormatted = argsFormatted.toString ();
        tdl.push ('tdl.data', argsFormatted);
      } catch (e) {
        // console.log(e)
        message.reply (`Invalid argument`);
      }
    }
  },
};
