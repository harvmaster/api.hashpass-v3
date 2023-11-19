'use strict'

import { Server } from 'socket.io'

type msg = {
  type: string,
  msg: any
}

/**
 * WebSocket Library
 * @memberof Services
 */

interface userConnection {
  id: string,
  type: string,
  client: any
}

class WebSocket {

  users: userConnection[]
  socket: Server

  constructor () {
    this.users = []
    this.socket
  }

  /**
   * Setup the Websocket server
   */
  async startServer (server) {
    // Setup Websockets
    this.socket = new Server(server, {
      cors: {
        origin: "*",
        methods: ['GET', 'POST']
      }
    })
    this.socket.on('connection', (client) => this._onConnection(client))
    console.log('started web socket')
  }

  async onJoin (client, msg) {
  }

  async onUpdate (client, msg) {
    
  }

  async onLocationUpdate (client, msg) {

  }

  async onAuthenticate (client, msg) {
    
  }

  
  async notify (msg: msg) {
    
  }

  /**
   * Triggered when a Websocket client connects
   * @param ws The Websocket of the client
   * @private
   */
  async _onConnection (client) {
    console.log('connection attempt')

    // Setup event listeners
    client.prependAny(console.log)
    client.on('update', (msg) => this.onUpdate(client, msg))
    client.on('join', (msg) => this.onJoin(client, msg))
    client.on('locationUpdate', (msg) => this.onLocationUpdate(client, msg))
    client.on('authenticate', (msg) => this.onAuthenticate(client, msg))
  }

}

const webSocket = new WebSocket()

export default webSocket