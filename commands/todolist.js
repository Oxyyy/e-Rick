const tdl = require("quick.db");

module.exports = {
  name: "todolist",
  description: "to-do list de e-Rick",
  aliases: ["tdl"],
  args: true,
  wip:true,
  usage: "e",
  cooldown: 5,
  async execute(message, args) {
    if (args[0] === "-add") {
        let argsFormatted = args.join(' ')
        argsFormatted = argsFormatted.replace('-add ', '')
        console.log(argsFormatted)
        tdlCount = tdl.length+1
        tdl.set(tdlCount, { task: argsFormatted})
        console.log(tdl)

      
      
    }
  },
};
