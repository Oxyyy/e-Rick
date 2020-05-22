module.exports = {
  name: "numberFormat",

  execute(rawNumber) {
    let formattedNumber;
    let rawNumber1;
    let rawNumber2;
    let rawNumber3;
    switch (true) {
      case rawNumber >= 1000 && rawNumber < 10000:
        rawNumber1 = rawNumber.toString().slice(0, 1);
        rawNumber2 = rawNumber.toString().slice(1, 5);
        formattedNumber = [rawNumber1, rawNumber2].join(",");
        return formattedNumber;
      case rawNumber >= 10000 && rawNumber < 100000:
        rawNumber1 = rawNumber.toString().slice(0, 2);
        rawNumber2 = rawNumber.toString().slice(2, 6);
        formattedNumber = [rawNumber1, rawNumber2].join(",");
        return formattedNumber;
      case rawNumber >= 100000 && rawNumber < 1000000:
        rawNumber1 = rawNumber.toString().slice(0, 3);
        rawNumber2 = rawNumber.toString().slice(3, 7);
        formattedNumber = [rawNumber1, rawNumber2].join(",");
        return formattedNumber;
      case rawNumber >= 1000000 && rawNumber < 10000000:
        rawNumber1 = rawNumber.toString().slice(0, 3);
        rawNumber2 = rawNumber.toString().slice(3, 6);
        rawNumber3 = rawNumber.toString().slice(6, 8);
        formattedNumber = [rawNumber1, rawNumber2, rawNumber3].join(",");
        return formattedNumber;
        default: {
          return rawNumber
        }
    }
  },
};
