import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { AddressInfo } from 'net'

import routes from './routes';

import mongoose from './services/mongoose'
import Socket from './services/socket'

import config from '../config'

let server;
export const startServer = async () => {
  
  // Connect to mongoDB
  try {
    console.log('Connecting to MongoDB')
    // Check if prod environment
    if (process.env.TS_NODE_DEV) {
      console.log('Connecting to prod MongoDB')
      await mongoose.connect(config.mongoDB)
      console.log('Connected to MongoDB')
    }

    // await mongoose.connect(config.mongoDB)
  } catch (err) {
    console.error(err.message)
  }

  //
  // Setup ExpressJS middleware, routes, etc
  //
  const app = express()
  app.use(cors())
  app.use(bodyParser.json())
  app.use(bodyParser.raw({ type: '*/*' }))
  app.use(function (err, req, res, next) {
    console.log('requested')
    next()
  })
  app.use(routes)

  //
  // Set port and start ExpressJS Server
  //
  server = app.listen(config.port)
  const address = server.address() as AddressInfo
  console.log('Starting ExpressJS server')
  console.log(`ExpressJS listening at http://${address.address}:${address.port}`)

  // enable socket.io
  try {
    console.log('Starting Socket.io server')
    Socket.startServer(server)
    console.log('Socket.io server started')
  } catch (err) {
    console.error(err.message)
  }
}

export const stopServer = async () => {
  server.close()
}