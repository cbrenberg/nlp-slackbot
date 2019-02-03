'use strict'

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();

service.set('serviceRegistry', serviceRegistry);

service.put('/service/:intent/:address', (req, res, next) => {
  const serviceIntent = req.params.intent;
  const serviceAddress = req.params.address;

  serviceRegistry.add(serviceIntent, serviceAddress);
  res.send({ result: `${serviceIntent} at ${serviceAddress}` })
})


module.exports = service;