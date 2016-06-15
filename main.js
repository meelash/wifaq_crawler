var fs = require('fs');
var json2csv = require('json2csv');
var request = require('request');
var extract = require('./extract');

var urlStart = "http://www.wifaqulmadaris.org/_reports/gazett-madaris.php?gender=M&Examtype=A&ExamYear=1437&course=+0802&Regid="
var urlEnd = "&Submit=";

var ilhaqNumber = 00000;
// var totalCount = 100;
var totalCount = 18000; // running with 100000 showed only schools up to 17970 in 2016
var list = []
var returnCount = 0;

console.log('starting');

// Build URL for the given ilhaqNumber, and request the page from it. Parse the page to extract the relevant data and push it to the list of schools. As requests come back check if they have all come back yet or not.
var makeRequest = (ilhaqNumber) => {
  var req = request({ uri: urlStart + ilhaqNumber + urlEnd, timeout: 120000 }, (error, response, body) => {
    if (error) {
      console.warn('error at ilhaq number ' + ilhaqNumber + ': ' + error);
      makeRequest(ilhaqNumber);
      return;
    }
    if (!error && response.statusCode == 200) {
      var school = {
        ilhaqNumber: ilhaqNumber,
        name: extract.getName(body),
        address: extract.getAddress(body),
        province: extract.getProvince(body)
      };
      if (!!school.name) {
        list.push(school)
      }
    }
    returnCount++;
    console.log(returnCount + ' for ' + ilhaqNumber);
    if (returnCount >= totalCount){
      onEnd();
      
    }
  })
  // console.log(req);
}

// Take list of schools, build csv out of it and write to disk.
var onEnd = () => {
  json2csv({ data: list, fields: ['ilhaqNumber', 'name', 'address', 'province'] }, function(err, csv) {
    if (err) console.log(err);
    fs.writeFile('ilhaqNumbers.csv', csv, function(err) {
      if (err) throw err;
      console.log('file saved');
    });
  });
};

// Main loop
while (ilhaqNumber < totalCount) {
  
  // The timeout lessens the load on the remote server which would cause connection dropping and failure to reach the IP, etc. Also, makes it possible to run the script without increase the max number of open file descriptors since all the requests don't queue up at once.
  ((num) => {setTimeout(()=>{makeRequest(num);}, num * 100);})(ilhaqNumber)
  
  ilhaqNumber++;
}