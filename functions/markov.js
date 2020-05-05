const MarkovChain = require("markovchain");
const messageLimitHundreds = 1;
const Discord = require("discord.js");

module.exports = {
  name: "newMarkov",
  async execute(message) {
    
    
    message.channel.messages.fetch({ limit: 100 }).then((channelFetch) => {
      // console.log(channelFetch)
      channelFetch = channelFetch.filter(value => !value.author.bot)
      channelFetch = channelFetch.map((message) => message.content);
      channelFetch = channelFetch.filter(word => !word.startsWith(';'))
      channelFetch = channelFetch.filter(word => !word.includes('<@'))
      channelFetch = channelFetch.filter(word => !word.includes('http'))

      let formattedMsg = channelFetch.join(' ')
      formattedMsg = (Object.values(channelFetch)).toString()
      formattedMsg = formattedMsg.replace(/,/g, ' ')
      formattedMsg = formattedMsg.toLowerCase()


      const quotes = new MarkovChain(formattedMsg);
      const chain = quotes.end(20).process()
      message.channel.send(chain);

    });
  },
};
