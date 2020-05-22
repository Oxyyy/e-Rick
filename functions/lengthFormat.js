module.exports = {
  name: "lengthFormat",

  execute(rawLength) {
    let minuteLength = parseFloat(rawLength / 60); // sépare la length en deux variables, les secondes et les minutes
    minuteLength = Math.trunc(minuteLength);
    let secondLength = rawLength - minuteLength * 60
    if (secondLength<10) {
        secondLength = `0${secondLength}`
    }
    let formattedLength = `${minuteLength}:${secondLength}`
    return formattedLength  
  },
};
