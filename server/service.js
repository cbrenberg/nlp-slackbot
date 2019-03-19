'use strict'

const express = require('express');
const service = express();

service.post('/', (req, res, next) => {
  res.send('You have awakened me').status(200);
})

module.exports = service;