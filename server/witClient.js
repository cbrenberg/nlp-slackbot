'use strict';

const axios = require('axios');

function handleWitResponse(response) {
  return response.entities;
}

module.exports = function witClient(token) {

  const ask = function ask(message, cb) {
    const config = {
      baseURL: 'https://api.wit.ai',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      params: {
        v: '20190121',
        q: message
      }
    };

    axios.get('/message', config)
      .then(response => {
        if (response.status != 200) {
          return cb(`Expected status code 200. Instead got ${response.status}.`);
        } else {
          const witResponse = handleWitResponse(response.data);
          return cb(null, witResponse);
        }
      })
      .catch(error => {
        return cb(error);
      })
  }

  return {
    ask: ask,
  }
}