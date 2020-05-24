const osu = require("ojsama");
let execOjsama = require("child_process").execSync;
module.exports = {
  name: "getPP",

   async execute(beatmapID, enabledMods, accuracy, combo, missCount) {
    const resultatOjsama = execOjsama(
      `curl https://osu.ppy.sh/osu/${beatmapID} | node ojsama.js +${enabledMods} ${accuracy}% ${combo}x ${missCount}m`, // parse actual score performance
        function (error, stdout, stderr) {
        const ojsamaData = stdout;
        const formattedOJData = ojsamaData.split("\n");
        let srData = formattedOJData[6].split(" ");
        if (srData[0].startsWith("+")) {
          srData = formattedOJData[7].split(" ");
          srData = srData[0];
          pprecentData = formattedOJData[10].split(" ");
          pprecentData = parseFloat(pprecentData[0]).toFixed();
          pprecentData = pprecentData.toString();
           getPPData = {
            ppData:   pprecentData,
            SR:   srData,
          }
          return getPPData;
        } else {
          srData = srData[0];
          pprecentData = formattedOJData[9].split(" ");
          pprecentData = parseFloat(pprecentData[0]).toFixed();
          pprecentData = pprecentData.toString();

           getPPData = {
            ppData:   pprecentData,
            SR:   srData,
          }
          return getPPData;
        }
      }
    )
    const resultToString = resultatOjsama.toString();
    const resultSplit = resultToString.split('\n');
    let resultPP = resultSplit[resultSplit.length - 2];
    let resultSR = resultSplit[resultSplit.length - 5];
    resultPP = resultPP.split(' ')
    resultPP = parseFloat(resultPP[0]).toFixed()
    resultSR = resultSR.split(' ')
    resultSR = parseFloat(resultSR[0])

    let getPPData = {
        pp: resultPP,
        sr: resultSR
    }


    return getPPData ;
  }
};
