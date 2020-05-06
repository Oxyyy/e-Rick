const { MessageEmbed } = require("discord.js");
const { blue } = require("../colours.json");
const Discord = require("discord.js");
const client = new Discord.Client();
let gameStart;
let A1 = "⚪";
let A2 = "⚪";
let A3 = "⚪";
let B1 = "⚪";
let B2 = "⚪";
let B3 = "⚪";
let C1 = "⚪";
let C2 = "⚪";
let C3 = "⚪";

module.exports = {
  name: "tictactoe",
  aliases: ["ttt"],
  args: true,
  wip:false,

  async execute(message, args) {
    if (args[0] === "duel") {
      switch (true) {
        case args.length !== 2:
          return message.reply("arguments invalide!");
        case gameStart:
          return message.reply("une partie est déja en cours!");
        default: {
          if (args[1].includes("<@")) {
            let Player1 = message.mentions.members.first();
            Player1 = Player1.user.tag;
            let Player2 = message.author;
            Player2 = Player2.tag;
            gameStart = true;
            let random1 = Math.floor(Math.random() * 2);
            if (random1 === 1) {
              player1Type = ":x:";
              player2Type = ":o:";
            } else {
              player1Type = ":o:";
              player2Type = ":x:";
            }
            let embedStart = new MessageEmbed()
              .setColor(blue)
              .setDescription(
                `${Player1} jouera le symbole ${player1Type}\n\n${Player2} jouera le symbole ${player2Type}`
              );
            message.channel.send(embedStart);
            console.log('TEST')

            await client.on("message", (message2) => {
                console.log('TEST2222')

              if (message2.author.tag === Player1) {
                console.log('player2')
                switch (true) {
                  case message2.content.includes("A1"):
                    A1 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("A2"):
                    A2 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("A3"):
                    A3 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("B1"):
                    B1 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("B2"):
                    B2 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("B3"):
                    B3 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("C1"):
                    C1 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("C2"):
                    C2 = player1Type;
                    sendEmbed()
                    break;
                  case message2.content.includes("C3"):
                    C3 = player1Type;
                    sendEmbed()
                    break;
                }
              } else if (message2.author.tag === Player2) {
                  console.log('player2')
                switch (true) {
                    case message2.content.includes("A1"):
                      A1 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("A2"):
                      A2 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("A3"):
                      A3 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("B1"):
                      B1 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("B2"):
                      B2 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("B3"):
                      B3 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("C1"):
                      C1 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("C2"):
                      C2 = player2Type;
                      sendEmbed()
                      break;
                    case message2.content.includes("C3"):
                      C3 = player2Type;
                      sendEmbed()
                      break;
                  }
              } else {
                  return;        
                }
              })
            

            
          } else return message.reply("arguments invalide!");
        }
      }
    }
    if (args[0] === "reset") {
      gameStart = false;
    }
    await gameStart;
  },
};
