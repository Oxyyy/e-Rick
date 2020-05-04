let tdl = require("quick.db");
let tdlCountValue = require("quick.db")

module.exports = {
  name: "database",
  description: "allows to edit e-rick's database",
  aliases: ["db"],
  args: true,
  wip:false,
  admin:true,
  usage: "<-show *object to show* or -all to return all of the db (in the console)> / <-add *object to add in the todolist*> / <-reset *object to delete from the db*>",
  cooldown: 5,
  async execute(message, args) {
    if (!tdlCountValue.get('value')) {
      tdlCountValue.set('value', { count: 1})
    }
    if (args[0] === '-show') {
      try {
      switch (true) {
        case args[1] === '-all':
          console.log(tdl.all())
          break;
        default: {
          message.channel.send(`\`${Object.values(tdl.get(args[1].toString()))}\``)
        }
      }
      
      }
      catch(e){
        message.reply(`Invalid argument`)
      } 
    }
    else if (args[0] === '-reset') {
      tdl.delete(args[1].toString())
    }
    else if (args[0] === "-add") {
        try {
          let argsFormatted = args.join(' ')
          argsFormatted = argsFormatted.replace('-add ', '')
          argsFormatted = argsFormatted.toString()
          tdl.push('todolist.data', argsFormatted)  

        }     
        catch(e) {
          message.reply(`Invalid argument`)
        }

           
    }
  },
};
