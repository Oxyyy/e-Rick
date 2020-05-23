module.exports = {
    name: "rankingIcon",
  
    execute(rankObtained) {
      let rankingIcon = "noRank"; // traduit le rank obtenu en icône à afficher
      switch (rankObtained) {
        case "A":
          rankingIcon = `<:rankA:713676251671560203>`;
          break;
        case "B":
          rankingIcon = `<:rankB:713676264761851924>`;
          break;
        case "C":
          rankingIcon = `<:rankC:713676275268583516>`;
          break;
        case "D":
          rankingIcon = `<:rankD:713676286303797348>`;
          break;
        case "S":
          rankingIcon = `<:rankS:713676296978300968>`;
          break;
        case "SH":
          rankingIcon = `<:rankSH:713676307703005224>`;
          break;
        case "X":
          rankingIcon = `<:rankX:713676319237472286>`;
          break;
        case "XH":
          rankingIcon = `<:rankXH:713676333309231106>`;
          break;
        default:
          (rankingIcon = `<:rankF:713676345695010906>`)
      }
  
      return rankingIcon;
    },
  };
  