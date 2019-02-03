'use strict'

const express = require('express');
const service = express();
const ServiceRegistry = require('./serviceRegistry');
const serviceRegistry = new ServiceRegistry();

service.set('serviceRegistry', serviceRegistry);

service.put('/service/:intent/:port', (req, res, next) => {
  const serviceIntent = req.params.intent;
  const servicePort = req.params.port;
  // console.log("req.connection.remoteAddress from service put request:", req.connection.remoteAddress);
  // console.log("req.headers['x-forwarded-for']:", req.headers['x-forwarded-for']);

  // const serviceIp = req.connection.remoteAddress.includes('::')
  //   ? `[${req.connection.remoteAddress}]`
  //   : req.connection.remoteAddress;

  // const serviceIp = req.headers['x-forwarded-for'];

  const serviceIp = 'https://dnd-slackbot-service.herokuapp.com';

  serviceRegistry.add(serviceIntent, serviceIp, servicePort);
  res.send({ result: `${serviceIntent} at ${serviceIp}:${servicePort}` })
})


module.exports = service;