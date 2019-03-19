'use strict'
require('dotenv').config();
const express = require('express');
const service = express();

const PORT = process.env.PORT || 3000;

const slackToken = process.env.SLACKBOT_TOKEN;
const slackClient = require('./slackClient');

const witToken = process.env.WIT_TOKEN
const witClient = require('./witClient')(witToken);

const rtm = slackClient.init(slackToken, witClient);
rtm.start();

service.post('/', (req, res, next) => {
  res.send('You have awakened me').status(200);
})

slackClient.addAuthenticatedHandler(rtm, () => {
  service.listen(PORT, () => {
    console.log(`IRIS is listening on port ${PORT} in ${service.get('env')} mode`);
  });
});

module.exports = service;