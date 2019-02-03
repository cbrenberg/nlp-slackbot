'use strict';

const { RTMClient, LogLevel } = require('@slack/client');
let rtm = null;
let nlp = null;
let registry = null;

const handleOnAuthenticated = (connectData) => {
  console.log(`Logged in as ${connectData.self.name} of team ${connectData.team.name}, but not yet connected to a channel.`)
}

const handleOnMessage = (message) => {

  if (message.text.toLowerCase().includes('phb')) {
    nlp.ask(message.text, (err, res) => {
      console.log('handleOnMessage response:', res);
      try {
        if (!res.intent || !res.intent[0] || !res.intent[0].value) {
          throw new Error("Could not extract intent");
        }

        const intent = require('../intents/' + res.intent[0].value + 'Intent')

        intent.process(res, registry, function (err, res) {
          if (err) {
            console.log('Error processing intent:', err.message);
            // return;
          }
          if (res) {
            rtm.sendMessage(res, message.channel)
          }
        })
      } catch (err) {
        console.log('Error with nlp:', err, res);
        rtm.sendMessage(`Sorry, I don't know what you mean.`, message.channel);
      }
    });
  }
}

const addAuthenticatedHandler = (rtm, handler) => {
  rtm.on('authenticated', handler);
}

module.exports.init = function slackClient(token, nlpClient, serviceRegistry) {
  rtm = new RTMClient(token, { logLevel: LogLevel.INFO });
  nlp = nlpClient;
  registry = serviceRegistry;
  addAuthenticatedHandler(rtm, handleOnAuthenticated);
  rtm.on('message', handleOnMessage);
  return rtm;
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;