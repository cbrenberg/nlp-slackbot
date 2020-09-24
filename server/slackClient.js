'use strict';

const { RTMClient, LogLevel } = require('@slack/client');
let rtm = null;
let nlp = null;

// console.log('=====================\n in slackClient.js\n ======================\n', process.env);

//log status on successful authentication with Slack real time messaging API
const handleOnAuthenticated = (connectData) => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}.`)
}

//process all incoming messages
const handleOnMessage = (message) => {
  //check for target string '/phb', process message if it exists, otherwise ignore
  if (message.text.toLowerCase().includes('phb')) {
    //send message text to natural language processing API
    nlp.ask(message.text, (err, res) => {
      console.log('handleOnMessage response:', res);
      try {
        //throw error if nlp doesn't return a valid intent
        if (!res.intent_entity || !res.intent_entity[0] || !res.intent_entity[0].value) {
          throw new Error("Could not extract intent");
        }
        //otherwise, require the associated intent module file
        const intent = require('../intents/' + res.intent_entity[0].value + 'Intent')
        //process message using module's 'process' method
        intent.process(res, process.env.SPELL_SERVICE_BASE_URL, function (err, res) {
          if (err) {
            console.log('Error processing intent:', err.message);
            // return;
          }
          if (res) {
            //send incoming processed response back to slack channel
            rtm.sendMessage(res, message.channel)
          }
        })
      } catch (err) {
        //log language processing error and response
        console.log('Error with nlp:', err, res);
        //send error feedback message to slack
        rtm.sendMessage(`Sorry, I don't know what you mean.`, message.channel);
      }
    });
  }
}

const addAuthenticatedHandler = (rtm, handler) => {
  rtm.on('authenticated', handler);
}

//export slackclient initialization function
//slackClient takes a bot token, a natural language processing instance, and a service registry instance
module.exports.init = function slackClient(token, nlpClient) {
  //initialize a Slack RTMClient instance with bot token
  rtm = new RTMClient(token, { logLevel: LogLevel.INFO });
  //assign incoming nlpClient to global nlp variable
  nlp = nlpClient;
  //assign authentication handler to new rtm client 
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  //assign message handling to rtm client
  rtm.on('message', handleOnMessage);
  //return complete rtm object
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;