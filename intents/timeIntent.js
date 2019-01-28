'use strict';

const axios = require('axios');

module.exports.process = function process(intentData, registry, cb) {

  if (intentData.intent[0].value !== "time") {
    return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`))
  }

  if (!intentData.location) {
    return cb(new Error(`Missing location in time intent`));
  }

  //strips iris's name from location string just in case
  const location = intentData.location[0].value.replace(/,*.?iris/i, '');
  //grab latitude and longitude from wit response
  const lat = intentData.location[0].resolved.values[0].coords.lat;
  const long = intentData.location[0].resolved.values[0].coords.long;

  const service = registry.get('time');
  if (!service) return cb(false, 'No service available');

  axios.get(`http://${service.ip}:${service.port}/service/location/?lat=${lat}&lng=${long}`)
    .then(res => {
      return cb(false, `The time in ${location} is ${res.data}`);
    })
    .catch(err => {
      console.log(err);
      return cb(false, `Apologies. I had some trouble finding the time in ${location}`);
    })

}