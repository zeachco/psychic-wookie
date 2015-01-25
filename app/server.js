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
var connexions = {};

function getIP(req) {
  var ip = req.headers["X-Forwarded-For"] || req.headers["x-forwarded-for"] || req.client.remoteAddress;
  return ip.replace('::ffff:', '');
}

function publish(data) {
  while (keepalives.length > 0) {
    var cb = keepalives.splice(0, 1)[0];
    cb(data);
  }
}

app.get('/maze', function(req, res) {
  res.json(tiles);
});

app.post('/player', function(req, res) {
  ip = getIP(req);
  console.log(ip, '/player', req.body);
  tiles.forEach(function(t) {
    t.havePlayer = (t.id == req.body.roomId);
  });

  publish({
    maze: true
  });

  res.end('ok');
});

app.post('/maze', function(req, res) {
  var ip = getIP(req);
  tiles = [];

  gameIP = ip;
  console.log(ip, 'post maze', req.body.tiles, req.body);
  try {
    req.body.tiles.forEach(function(t) {

      console.log('new tile: ', t);
      if (t) {
        var tile = new Tile(t);
        tiles.push(tile);
      }

    });

    publish({
      maze: true
    });

  } catch (e) {
    console.log(e);
  }

  publish();

  res.end('ok');
});

app.post('/message', function(req, res) {
  var ip = req.body.user || getIP(req);
  console.log(ip + ' :', req.body.message);

  if (req.body.message.length > 0) {
    messages.push(ip + ': ' + req.body.message);
  }

  publish({
    messages: messages
  });

  if (ip == gameIP) {
    messages = [];
  }

  res.end('ok');
});

app.get('/events', function(req, res) {
  var ip = getIP(req);

  function keepalive(data) {
    if (ip == gameIP) {
      console.log(ip, 'client fetch', data);
    }
    try {
      res.json(data || {});
    } catch (e) {
      console.log('cannot return keep-alive. ' + ip);
      res.end(e);
    }
  }

  if (connexions[ip]) {
    connexions[ip].refreshTime = new Date();
    console.log(ip, 'holding connexion', connexions[ip]);
    keepalives.push(keepalive);
  } else {
    var d = new Date();
    connexions[ip] = {
      connectedTime: d,
      refreshTime: d
    };
    console.log(ip, 'registration', connexions[ip]);
    keepalive({
      messages: messages
    });
  }

});

var server = app.listen(serverPort, function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
