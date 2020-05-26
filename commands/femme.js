module.exports  = {
    name:"femme",
    aliases:["roland"],
    execute(message, args) {
        message.channel.send('la variable femme n\'est pas déclarée')
    }
}