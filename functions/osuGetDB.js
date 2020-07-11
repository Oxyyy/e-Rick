
module.exports = {
    name: 'osuGetDB',

    async execute(fb, message){

        let userID = await fb.collection('osuAccounts').doc(message.author.id).get().then((q) => {
            if (q.data()) return q.data().osuID
            return false;
          })
        
        if (userID) {
            return userID;
        }
        return false;

    }
}