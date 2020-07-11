const Minesweeper = require("discord.js-minesweeper");
const Discord = require("discord.js");

const { blue } = require("../colours.json");

module.exports = {
  name: "minesweeper",
  guildOnly: true,
  aliases: ["ms", "demineur", "boom"],

  async execute(message, args) {
    let rows = 6;
    let columns = 8;
    let mines = 10;

    async function prepareMatrix(rows, columns, mines) {
      const minesweeper = new Minesweeper({
        rows: rows,
        columns: columns,
        mines: mines,
        emote: "boom",
        returnType: "emoji",
      });
      const matrix = minesweeper.start();
      return matrix;
    }

    if (args.length > 0) {
      if (args[0] == "start") {
        let matrix = await prepareMatrix(6, 8, 10);
        return message.channel.send(matrix);
      } else {
        return message.reply("argument invalide!");
      }
    } else {
      let embedConstructor = new Discord.MessageEmbed()
        .setColor(blue)
        .setAuthor("Minesweeper configuration:")
        .setDescription(
          "React :one: or :two: to increase/decrease size\n\nReact :three: or :four: to increase/decrease the amount of mines\n\nReact :five: to start the game"
        );

      async function prepareConfig() {
        embedConstructor.fields = [];
        embedConstructor.addFields(
          {
            name: "Size:",
            value: `${rows}x${columns}`,
            inline: true,
          },
          {
            name: "Mines:",
            value: `x${mines}`,
            inline: true,
          }
        );
        return embedConstructor;
      }

      let embed = await prepareConfig(6, 8, 10);
      message.channel.send(embed).then((configEmbed) => {
        const filter = (reaction, user) => {
          return (
            ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"].includes(reaction.emoji.name) &&
            user.id !== configEmbed.author.id
          );
        };

        async function botReact() {
          if (rows < 10) {
            configEmbed.react("1️⃣");
          }
          if (rows > 4 && mines < ((rows-2)*(columns-2))/2) {
            configEmbed.react("2️⃣");
          }
          if (rows > 4 && mines < (rows*columns)/2) {
            configEmbed.react("3️⃣");
          }
          if (mines > 2) {
            configEmbed.react("4️⃣");
          }
          configEmbed.react("5️⃣");
        }

        async function reactionWait() {
          configEmbed
            .awaitReactions(filter, {
              max: 1,
              time: 60000,
              errors: ["time"],
            })
            .then(async (collected) => {
              const reaction = collected.first();

              if (reaction.emoji.name === "1️⃣") {
                rows += 2;
                columns += 2;
                let embed = await prepareConfig(rows, columns, mines);
                configEmbed.edit(embed);
                configEmbed.reactions.removeAll();
                botReact(configEmbed);
                reactionWait(
                  filter,
                  configEmbed,
                  embedConstructor,
                  rows,
                  columns,
                  mines
                );
              }

              if (reaction.emoji.name === "2️⃣") {
                rows -= 2;
                columns -= 2;
                let embed = await prepareConfig(rows, columns, mines);
                configEmbed.edit(embed);
                configEmbed.reactions.removeAll();
                botReact(configEmbed);
                reactionWait(
                  filter,
                  configEmbed,
                  embedConstructor,
                  rows,
                  columns,
                  mines
                );
              }

              if (reaction.emoji.name === "3️⃣") {
                mines += 2;
                let embed = await prepareConfig(rows, columns, mines);
                configEmbed.edit(embed);
                configEmbed.reactions.removeAll();
                botReact(configEmbed);
                reactionWait(
                  filter,
                  configEmbed,
                  embedConstructor,
                  rows,
                  columns,
                  mines
                );
              }
              if (reaction.emoji.name === "4️⃣") {
                mines -= 2;
                let embed = await prepareConfig(rows, columns, mines);
                configEmbed.edit(embed);
                configEmbed.reactions.removeAll();
                botReact(configEmbed);
                reactionWait(
                  filter,
                  configEmbed,
                  embedConstructor,
                  rows,
                  columns,
                  mines
                );
              }
              if (reaction.emoji.name === "5️⃣") {
                let embed = await prepareMatrix(rows, columns, mines);
                configEmbed.channel.send(embed);
                configEmbed.delete();
              }
            })
            .catch((collected) => {
              // if no reactions after 60 seconds, delete them
              configEmbed.reactions
                .removeAll()
                .catch((error) =>
                  console.error("Failed to clear reactions: ", error)
                );
            });
        }
        botReact(configEmbed);
        reactionWait(filter, configEmbed, rows, columns, mines);
      });
    }
  },
};
