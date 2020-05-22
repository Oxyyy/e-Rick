module.exports = {
  name: "rankingColor",

  execute(rankObtained) {
    let rankingColor;
    switch (rankObtained) {
      case "A":
        rankingColor = "#13ae58";
        break;
      case "B":
        rankingColor = "#136fc4";
        break;
      case "C":
        rankingColor = "#6a14bc";
        break;
      case "D":
        rankingColor = "#a91313";
        break;
      case "S":
        rankingColor = "#bc8c13";
        break;
      case "SH":
        rankingColor = "#9a9a9a";
        break;
      case "X":
        rankingColor = "#bc8c13";
        break;
      case "XH":
        rankingColor = "#9a9a9a";
        break;
      default:
        rankingColor = "#f51007";
    }
    return rankingColor;
  },
};
