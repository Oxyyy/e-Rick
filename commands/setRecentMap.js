const db = require('quick.db')

module.exports = {
    name: 'setRecentMap',
    aliases: ['rsedit'],
    args: true,

    execute(message, args){
        db.set("most recent map", { recentMap: args[0] });
        message.channel.send(`Most recent map set to ${args[0]}`)
    }
    
}