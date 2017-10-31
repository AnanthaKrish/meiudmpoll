var express = require('express');
var app = express();



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/mediumDaily', function(request, response) {
  //response.render('pages/index');

  var request = require('request');
  var https = require('https');
  var parseString = require('xml2js').parseString;
  var xml = '';

  function xmlToJson(url, callback) {
  var req = https.get(url, function(res) {
    var xml = '';

    res.on('data', function(chunk) {
      xml += chunk;
    });

    res.on('error', function(e) {
      callback(e, null);
    });

    res.on('timeout', function(e) {
      callback(e, null);
    });

    res.on('end', function() {
      parseString(xml, function(err, result) {
        callback(null, result);
      });
    });
  });
}

var url = "https://medium.com/feed/anantha-krishnan-k-g"

xmlToJson(url, function(err, data) {
  if (err) {
    // Handle this however you like
    return console.err(err);
  }

  // Do whatever you want with the data here
  // Following just pretty-prints the object
  //console.log(JSON.stringify(data, null, 2));
  var tt = JSON.stringify(data, null, 2);
  var objectValue = JSON.parse(tt);

  var g = objectValue['rss']['channel'][0];
  //console.log(g['item'][0]['title']);

  var ott = [];

  for(var item in g['item']){
    //console.log(g['item'][item]['title']);

    var data = {
      title: g['item'][item]['title'],
      link: g['item'][item]['link'],
      description : g['item'][item]['content:encoded']
    };
    ott.push(data);
  }
  response.send(ott);
});

});
