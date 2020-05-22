module.exports = {
  name: "rankingIcon",

  execute(rankObtained) {
    let rankingIcon = "noRank"; // traduit le rank obtenu en icône à afficher
    switch (rankObtained) {
      case "A":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131770419970069/Ranking-A2x.png`;
        break;
      case "B":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131771619672095/Ranking-B2x.png`;
        break;
      case "C":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131773893115934/Ranking-C2x.png`;
        break;
      case "D":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131768511692810/Ranking-D2x.png`;
        break;
      case "S":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131769610731520/Ranking-S2x.png`;
        break;
      case "SH":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131824178495528/ranking-SH2x.png`;
        break;
      case "X":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131826342756423/Ranking-X2x.png`;
        break;
      case "XH":
        rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706131827466829874/ranking-XH2x.png`;
        break;
      default:
        (rankingIcon = `https://cdn.discordapp.com/attachments/612312867139616769/706551337332244480/deaddeathgravegraveyardhalloweenscaryicon-1320183477745266883.png`)
    }

    return rankingIcon;
  },
};
