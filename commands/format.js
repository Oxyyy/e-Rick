const fs = require("fs");

module.exports = {
  name: "format",

  execute(message, args) {
    console.log("OK");
    var data = fs.readFileSync("./general1.txt", "utf8");

    console.log(typeof data);
    console.log("1");
    let dataArray = data.split(" ");
    console.log("2");
    let result = dataArray.filter((word) => word.length > 10);
    console.log("3");
    result = result.toString();
    console.log("4");
    fs.appendFileSync('./general3.txt', result, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    console.log("5");
  },
};
