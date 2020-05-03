module.exports = {
	name: 'multiply',
    description: 'returns the product of 2 numbers',
    args:true,
    usage: '<nombre1> <nombre2>',
	execute(message, args) {
            if (args.length < 2) {
                message.channel.send("Commande incorrecte")
                return
            }
            let product = 1 
            args.forEach((value) => {
                product = product * parseFloat(value)
            })
            message.channel.send(product.toString())
        
	},
};