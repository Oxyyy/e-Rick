module.exports = {
    execute(message, A1, A2, A3, B1, B2, B3, C1, C2, C3) {
        function sendEmbed(message, A1, A2, A3, B1, B2, B3, C1, C2, C3) {
            let embed = new MessageEmbed().setColor(blue).setDescription(`
              ${A1}  ${A2}  ${A3} \n
              ${B1}  ${B2}  ${B3} \n
              ${C1}  ${C2}  ${C3}\n`);
            message.channel.send(embed);
          }
    }   
}