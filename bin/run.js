'use strict';

//require node modules
require('dotenv').config();

//require modules
const service = require('../server/service');

const PORT = process.env.PORT || 3000;

const slackToken = process.env.SLACKBOT_TOKEN;
const slackClient = require('../server/slackClient');

const witToken = process.env.WIT_TOKEN
const witClient = require('../server/witClient')(witToken);

const serviceRegistry = service.get('serviceRegistry');
const rtm = slackClient.init(slackToken, witClient, serviceRegistry);
rtm.start();

slackClient.addAuthenticatedHandler(rtm, () => {
  service.listen(PORT, () => {
    console.log(`IRIS is listening on port ${PORT} in ${service.get('env')} mode`);
  });
});