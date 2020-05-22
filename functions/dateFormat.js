const config = require("../config.json");

module.exports = {
  name: "dateFormat",
  execute(rawDate) {
    let minuteScore = rawDate.slice(8, 11);
    let hourScore = parseFloat(rawDate.slice(6, 8)) + config.UTCincrement;
    if (hourScore >= 24) {
      hourScore -= 24;
    }
    hourScore = hourScore.toString();
    rawDate = rawDate.slice(0, 6);
    let scoreTime = hourScore + minuteScore;
    let formattedDate = rawDate + scoreTime;
    return formattedDate;
  },
};
