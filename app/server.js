var express = require('express');
var app = express();
var request = require('request');
var serverPort = 3000;
var serveIndex = require('serve-index');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
app.use(serveIndex(__dirname + '/public'));

var chats = [];
var Tile = require('./models/Tile');
var tiles = [];
var messages = [];
var keepalives = [];

function getIP(req) {
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  return ip.replace('::ffff:', '');
}

app.post('/maze', function(req, res) {
  tiles = [{
    "x": 1,
    "y": 4,
    "type": "arrggg",
    "rotation": 90
  }];
  console.log(getIP(req), 'post maze', req.body);

  req.body.tiles.forEach(function(t) {
    var tile = new Tile(t);
    console.log('new tile: ', tile);
    tiles.push(tile);
    res.end();
  });

});

app.get('/maze', function(req, res) {
  res.json(tiles);
});

app.post('/message', function(req, res) {
  console.log('message', req.body);
  messages.push(req.body.message);
  while (keepalives.length > 0) {
    var cb = keepalives.splice(0, 1)[0];
    cb({
      messages: messages
    });
    messages = [];
  }
  res.end();
});

app.get('/events', function(req, res) {
  var ip = getIP(req);
  console.log(ip, 'holding connexion');
  var keepalive = function(data) {
    console.log(ip, 'réponse', data);
    try {
      res.json(data || {});
    } catch (e) {
      console.log('cannot return keep-alive. ' + ip, e);
    }
  };
  keepalives.push(keepalive);
});

var server = app.listen(serverPort, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
