var fs = require('fs');
var json2csv = require('json2csv');
var request = require('request');

var urlStart = "http://www.wifaqulmadaris.org/_reports/gazett-madaris.php?gender=M&Examtype=A&ExamYear=1437&course=+0802&Regid="
var urlEnd = "&Submit=";

var ilhaqNumber = 00000;
var totalCount = 9000;
var list = []
var returnCount = 0;

console.log('starting');

while (ilhaqNumber < totalCount) {
  ((ilhaqNumber) => {
    var req = request(urlStart + ilhaqNumber + urlEnd, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        var startLoc = body.indexOf('z-index:25;top:55px;left:663px;width:341px;height:38px;text-align:right;') + 119;
        var subStr = body.substr(startLoc, 1000);
        var endLoc = subStr.indexOf(' </span></div>');
        var result = subStr.slice(0, endLoc);
        // console.log(result);
        if (!!result) {
          list.push({ilhaqNumber: ilhaqNumber, school: result});
        }
      }
      returnCount++;
      console.log(returnCount + ' for ' + ilhaqNumber);
      if (returnCount >= totalCount){
        onEnd();
        
      }
    })
    // console.log(req);
  })(ilhaqNumber);
  
  ilhaqNumber++;
}

onEnd = () => {
  json2csv({ data: list, fields: ['ilhaqNumber', 'school'] }, function(err, csv) {
    if (err) console.log(err);
    fs.writeFile('ilhaqNumbers.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  });
};