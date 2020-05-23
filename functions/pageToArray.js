module.exports = {
  name: "pageToArray",

  execute(pageCount) {
    switch (true) {
      case pageCount == 1:
        var scoresToCheck = [1, 2];
        return scoresToCheck;
      case pageCount == 2:
        var scoresToCheck = [3, 4];
        return scoresToCheck;
      case pageCount == 3:
        var scoresToCheck = [5, 6];
        return scoresToCheck;
      case pageCount == 4:
        var scoresToCheck = [7, 8];
        return scoresToCheck;
      case pageCount == 5:
        var scoresToCheck = [9, 10];
        return scoresToCheck;
        case pageCount == 6:
        var scoresToCheck = [11, 12];
        return scoresToCheck;
        case pageCount == 7:
        var scoresToCheck = [13, 14];
        return scoresToCheck;
        case pageCount == 8:
        var scoresToCheck = [15, 16];
        return scoresToCheck;
        case pageCount == 9:
        var scoresToCheck = [17, 18];
        return scoresToCheck;
        case pageCount == 10:
        var scoresToCheck = [19, 20];
        return scoresToCheck;
    }
  },
};
