const { MessageEmbed } = require("discord.js");
let osu = require("node-osu");
let apiKey = require("../config.json");
let db = require("quick.db");

const fetch = require("node-fetch")

const osuApi = new osu.Api(apiKey, {
    parseNumeric: true // Parse numeric values into numbers/floats, excluding ids
});

module.exports = {
  name: "compare",
  aliases: ["c", "comp"],
  cooldown: 30,

  async execute(message, arguments) {
      let userID;
    if (!args.length) { // checking if the player exists in the local database
        if (!db.get(message.author.id)) 
          return message.reply(
            "vous devez link votre compte osu, plus d'infos avec `;help osulink`"
          );
        userID = db.get(message.author.id);
        userID = Object.values(userID);
      } else userID = args[0];

    let recentMap = db.get("most recent map");
    recentMap = parseFloat(Object.values(recentMap));
    userID = db.get(message.author.id)
    userID = (Object.values(userID)).toString()

    message.channel.send(`id de la map récente: ${recentMap}\nid de l'utilisateur correspondant: ${userID}`)

    // const scoreData = osuApi 
    // .getScores({b: recentMap},{u: userID})
    // .then((scoreData) => {
    //     console.log(scoreData)

    fetch(`https://osu.ppy.sh/api/get_scores?k=${apiKey.osuToken}&b=${recentMap}&u=${userID}`)
    .then(async res => res.json())
    .then(async body => {
        console.log(body)

    })
  },
};
