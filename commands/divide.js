module.exports = {
	name: 'divide',
    description: 'returns the quotient of 2 numbers',
    args:true,
    usage: '<nombre1> <nombre2>',
	execute(message, args) {
        if (args.length < 2) {
            message.channel.send("Commande incorrecte")
            return
        }
        let divide = args[0] / args[1]
        message.channel.send(divide.toString())
        
	},
};