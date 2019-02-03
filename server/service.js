'use strict'

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();

service.set('serviceRegistry', serviceRegistry);

service.put('/service/:intent/:port', (req, res, next) => {
  const serviceIntent = req.params.intent;
  // const servicePort = req.params.port;
  console.log('x-forwarded-port:', req.headers['x-forwarded-port']);
  const servicePort = req.headers['x-forwarded-port'] || req.params.port;
  // console.log("req.connection.remoteAddress from service put request:", req.connection.remoteAddress);
  // console.log("req.headers['x-forwarded-for']:", req.headers['x-forwarded-for']);

  const serviceIp = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0]
    : (req.connection.remoteAddress.includes('::')
      ? `[${req.connection.remoteAddress}]`
      : req.connection.remoteAddress
    );



  serviceRegistry.add(serviceIntent, serviceIp, servicePort);
  res.send({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` })
})


module.exports = service;