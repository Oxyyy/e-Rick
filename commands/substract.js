module.exports = {
	name: 'substract',
    description: 'returns the difference between 2 numbers',
    args:true,
    usage: '<nombre1> <nombre2>',
	execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Commande incorrecte")
            return
        }
        let substract = args[0] - args[1]
        message.channel.send(substract.toString())
        
	},
};