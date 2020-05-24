const getPP = require("../functions/getPP.js")

module.exports = {
    name: "testgetpp",
    args: true,

    execute(message, args) {
        let getPPData = getPP.execute(args[0], args[1], args[2], args[3], args[4]).then(data => {
            // console.log(data)
            message.channel.send(data)
        });
        

      


    }
}