module.exports = {
	name: 'sum',
    description: 'returns the sum of 2 numbers',
    args:true,
    usage: '<nombre1> <nombre2>',
	execute(message, args) {
		if (args.length < 2) {
            message.channel.send("Commande incorrecte")
            return
        }
        let sum = 0 
        args.forEach((value) => {
            sum = sum + parseFloat(value)
        })
        message.channel.send(sum.toString())
	},
};