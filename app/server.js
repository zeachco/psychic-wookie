var express = require('express');
var app = express();
var serverPort = 3000;
//var serveIndex = require('serve-index');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));
//app.use(serveIndex(__dirname + '/public'));

var chats = [];
var Tile = require('./models/Tile');
var tiles = [];
var messages = [];
var keepalives = [];
var gameIP = '';

function getIP(req) {
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  return ip.replace('::ffff:', '');
}

function publish(){
  while (keepalives.length > 0) {
    var cb = keepalives.splice(0, 1)[0];
    cb({
      messages: messages
    });
  }
}

app.get('/maze', function(req, res) {
  res.json(tiles);
});

app.post('/maze', function(req, res) {
  var ip = getIP(req);
  tiles = [];
  gameIP = ip;
  console.log(ip, 'post maze', req.body.tiles);
  try{
    req.body.tiles.forEach(function(t) {
      var tile = new Tile(t);
      console.log('new tile: ', tile);
      tiles.push(tile);
    });
  }catch(e){
    console.log(e);
  }

  res.end();

});

app.post('/message', function(req, res) {
  var ip = getIP(req);
  console.log(ip + ' :', req.body.message);
  messages.push({
    user: ip,
    message: req.body.message
  });

  publish();

  if(ip == gameIP){
    messages = [];
  }

  res.end();
});

app.get('/events', function(req, res) {
  var ip = getIP(req);
  console.log(ip, 'holding connexion');
  var keepalive = function(data) {
    if(ip == gameIP){
      console.log(ip, 'client fetch', data);
    }
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
