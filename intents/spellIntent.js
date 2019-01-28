'use strict';

const axios = require('axios');

module.exports.process = function process(intentData, registry, cb) {

  if (intentData.intent[0].value !== "spell") {
    return cb(new Error(`Expected spell intent, instead got ${intentData.intent[0].value}`))
  }

  if (!intentData.spellName) {
    return cb(new Error(`Missing spellName in spell intent`));
  }

  //strips iris's name from location string just in case
  const spellName = intentData.spellName[0].value.replace(/,*.?iris/i, '');

  const service = registry.get('spell');
  if (!service) return cb(false, 'No service available');

  axios.get(`http://${service.ip}:${service.port}/service/spell/${spellName}`)
    .then(res => {
      return cb(false, `${spellName}: ${res.data}`);
    })
    .catch(err => {
      console.log(err.data);
      return cb(false, `Apologies. I had some trouble finding information about ${spellName}.`);
    })

}