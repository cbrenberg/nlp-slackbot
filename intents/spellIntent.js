'use strict';
// require('dotenv').config({ path: '../.env' });
const axios = require('axios');

module.exports.process = function process(intentData, address, cb) {

  if (intentData.intent[0].value !== "spell") {
    return cb(new Error(`Expected spell intent, instead got ${intentData.intent[0].value}`))
  }

  if (!intentData.spellName) {
    return cb(new Error(`Missing spellName in spell intent`), `Sorry, I don't know any spell by that name.`);
  }

  //strips phb's name from location string just in case
  const spellName = intentData.spellName[0].value.replace(/,*.?phb/i, '');

  // const service = registry.get('spell');
  // if (!service) return cb(false, 'No service available');
  // console.log(process.env ? process.env : 'process.env is undefined')

  axios.get(`${address}/${encodeURIComponent(spellName)}`)
    .then(res => {
      return cb(false, `${spellName}: ${res.data}`);
    })
    .catch(err => {
      console.log('Error communicating with spell service', err);
      return cb(false, `Apologies. I had some trouble finding information about ${spellName}.`);
    })

}