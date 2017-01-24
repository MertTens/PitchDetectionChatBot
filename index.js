//=========================================================
// To Do
// 1. Implement tic tac toe
// 2. movie database api that learns what types of movies you like??
// 3. open itunes
// 4. Try to add voice recognition/pitch detection
//=========================================================


var restify = require('restify');
var builder = require('botbuilder');

//Initialize Cleverbot
var cleverbot = require("cleverbot.io");
var cbot = new cleverbot('0agYRpV0eTEAabyL','a5IlKuZnWZXOPUBDsZIAiKKqA95NNcAX');
cbot.setNick("sandbox.test");


//Initialize local itunes player

iTunesControl = require("itunescontrol");



//Initialize twitter API
const Twitter = require('./node_modules/twitter/lib/twitter')

const client = new Twitter({
  consumer_key: "TUwvQTog92da38K9BTBSV4e1C",
  consumer_secret: "AReMsG32cmkPQut5JYnU2hWH1P9558ZoLGBVQ1FcWCefAITDe1",
  access_token_key: "2827262114-zVxqDQKakzbeab21NkUM2TY2dsBGfGvAcnmJAv2",
  access_token_secret: "rVaOeMetc5rERN5pFjaxMYtR3IneKyq99dHS381SdYtTU"
})

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: "c0dbd3bc-7961-4663-ad0e-ed87cf94dd3b",
    appPassword: "eiQ1TjurSGJy81pcT255y2g"
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();
//var bot = new builder.UniversalBot(connector);

var introduction = false;

var myResponse = "nothing";

cbot.create(function (err, session) {

var cleverbotResponse = "Heyyyy";

bot.dialog('/', [
    function (session, args, next) {
    	if(!introduction)	{
        	builder.Prompts.text(session, 'Hi! What is your name?');
        	introduction = true;
        }
        else{
        	cbot.ask(myResponse, function (err, response) {
  			cleverbotResponse = response;
  			builder.Prompts.text(session, response);
  			console.log(response);
		});
        	session.beginDialog('/cleverBot');
        }
    },
    function (session, results, next) {
    	myResponse = results.response;
    	session.beginDialog('/cleverBot');
    	//console.log(results.response);
    	//session.send('hi');
    	//session.userData.name = results.response;
    	//next();

    }

]);

bot.dialog('/cleverBot', [
	function (session, next)	{
		console.log(myResponse);
		cbot.ask(myResponse, function (err, response) {
  			cleverbotResponse = response;
  			builder.Prompts.text(session, response);
  			console.log(response);
		});
	},
	function (session, results, next)	{
		myResponse = results.response;

    if(results.response == "itunes")  {
      session.replaceDialog('/itunes');
    }

		if(results.response == 'tweet')	{
			session.replaceDialog('/tweet');
		}
		session.replaceDialog('/cleverBot');
	}
]);

bot.dialog('/tweet', [
	function (session)	{
		builder.Prompts.text(session, 'What would you like to tweet?');
	},

	function (session, results)	{

    var length = (results.response).length;
    if(length<5)  {
		client.post('statuses/update', {status: results.response},  function(error, tweet, response) {
  				if(error) throw error;
 				//console.log(tweet);  // Tweet body. 
  				//console.log(response);  // Raw response object. 
			});

		session.send("You tweeted: "+results.response);
		session.send("You will now chat with the cleverbot");
		session.replaceDialog('/cleverBot');
    }
    else  {
      session.send("Your tweet is too long");
      session.replaceDialog('/tweet');
    }


	}

]);

bot.dialog('/itunes', [
  function (session)  {

    builder.Prompts.text(session, 'Which song would you like to play?');
  },

  function (session, results) {
    iTunesControl.search(results.response, function (results) {
 
    console.log("RESULTS!", results.length);
    
    if(results.length > 0)
      iTunesControl.play(results[0].id);
    else  {
      session.send("This song doesn't exist");
      session.send("You will now talk to cleverbot");
    }
    });

    session.replaceDialog('/cleverBot');
  }
  ]);


});






