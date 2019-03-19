'use strict'
const awsServerlessExpress = require('aws-serverless-express');
const service = require('./server/service');
const server = awsServerlessExpress.createServer(service);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context);