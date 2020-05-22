const MarkovChain = require("markovchain");
const messageLimitHundreds = 1;
const Discord = require("discord.js");
const fs = require('fs')

module.exports = {
  name: "expMarkov",
  aliases: ['expmarkov', 'exp'],
  cooldown: 30,
  async execute(message) { 
    let msg = await message.channel.send(`\`Je réfléchis...\``);
    var channelFetch = fs.readFileSync("./general1.txt", "utf8");
    channelFetch = channelFetch.split(' ')
      channelFetch = channelFetch.filter(word => !word.startsWith(';'))
      channelFetch = channelFetch.filter(word => !word.startsWith('!'))
      channelFetch = channelFetch.filter(word => !word.includes('*'))
      channelFetch = channelFetch.filter(word => !word.includes('@'))
      channelFetch = channelFetch.filter(word => !word.includes('['))
      channelFetch = channelFetch.filter(word => !word.includes(']'))
      channelFetch = channelFetch.filter(word => !word.includes(':'))
      channelFetch = channelFetch.filter(word => !word.includes('�'))
      channelFetch = channelFetch.filter(word => !word.includes('+'))
      channelFetch = channelFetch.filter(word => !word.includes('@'))
      channelFetch = channelFetch.filter(word => !word.includes('('))
      channelFetch = channelFetch.filter(word => !word.includes(')'))
      channelFetch = channelFetch.filter(word => !word.includes('1'))
      channelFetch = channelFetch.filter(word => !word.includes('2'))
      channelFetch = channelFetch.filter(word => !word.includes('3'))
      channelFetch = channelFetch.filter(word => !word.includes('4'))
      channelFetch = channelFetch.filter(word => !word.includes('5'))
      channelFetch = channelFetch.filter(word => !word.includes('6'))
      channelFetch = channelFetch.filter(word => !word.includes('7'))
      channelFetch = channelFetch.filter(word => !word.includes('8'))
      channelFetch = channelFetch.filter(word => !word.includes('9'))
      channelFetch = channelFetch.filter(word => !word.includes('e-rick'))
      channelFetch = channelFetch.filter(word => !word.includes('followers'))
      channelFetch = channelFetch.filter(word => !word.includes('months'))
      channelFetch = channelFetch.filter(word => !word.includes('seconds'))
      channelFetch = channelFetch.filter(word => !word.includes('days'))
      channelFetch = channelFetch.filter(word => !word.includes('ago'))
      channelFetch = channelFetch.filter(word => !word.includes('hours'))
      channelFetch = channelFetch.filter(word => !word.includes('top'))
      channelFetch = channelFetch.filter(word => !word.includes('standard'))
      channelFetch = channelFetch.filter(word => !word.includes('play'))
      channelFetch = channelFetch.filter(word => !word.includes('for'))
      channelFetch = channelFetch.filter(word => !word.includes('official'))
      channelFetch = channelFetch.filter(word => !word.includes('http'))
      channelFetch = channelFetch.filter(word => !word.includes('AM'))
      channelFetch = channelFetch.filter(word => !word.includes('PM'))
      




      let formattedMsg = channelFetch.join(' ')
      formattedMsg = (Object.values(channelFetch)).toString()
      formattedMsg = formattedMsg.replace(/,/g, ' ')
      formattedMsg = formattedMsg.toLowerCase()

      const quotes = new MarkovChain(formattedMsg);
      let chain = quotes.end(8).process()
      chain = chain.replace('osu! official server', '')
      chain = chain.replace('osu!', '')
      chain = chain.replace('recent', '')
      chain = chain.replace('@everyone', '')
      msg.delete()
      message.channel.send(chain);
    ;
  },
};
