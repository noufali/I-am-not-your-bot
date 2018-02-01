var express = require('express');
var app = express();
var fs = require('fs');
const twilio = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
app.use(urlencoded({extended: false}));
const RiveScript = require('rivescript');
var bot = new RiveScript();
bot.loadDirectory("brain", loading_done, loading_error);
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var reply;

var client = new twilio('XXX', 'XXX');

io.sockets.on('connection', function (socket) {

socket.on('answers', function (data) {
  });
});

function loading_done (batch_num) {
  console.log("Batch #" + batch_num + " has finished loading!");
  bot.sortReplies();
}

function loading_error (error) {
  console.log("Error when loading files: " + error);
}

app.post('/voice', (request, response) => {

  const twiml = new twilio();

  gather = twiml.gather({input: 'speech', action: '/gather', timeout:3});
  gather.say('Hello. You are bothering me', {voice: 'alice'});

  twiml.redirect('/voice');

  response.type('text/xml');
  response.send(twiml.toString());
});

app.post('/gather', (request, response) => {

  const twiml = new twilio();
  var city = request.body.CallerCity.toString();
  var state = request.body.FromState;
  var speech =  request.body.SpeechResult;
  reply = bot.reply("local-user", request.body.SpeechResult);
  console.log("The human says: " + request.body.SpeechResult);
  console.log("The bot says: " + reply);

  gather = twiml.gather({input: 'speech', action: '/gather', timeout:3});
  //gather.say('I know you. Your are from' + city.toLowerCase() + state, {voice: 'alice'});
  gather.say(reply, {voice: 'alice'});

  //console.log(request.body);

  response.type('text/xml');
  response.send(twiml.toString());
});

app.post('/alice', (request, response) => {
  console.log(request.body);
  response.send(request.body);
});

server.listen(8800, function () {
  console.log('Server listening on port 8800!')
})

app.use(express.static('public'));
