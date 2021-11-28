require('dotenv').config()
const express = require('express')
const path = require('path')
const http = require('http')
const WebSocket = require('ws')
const cors = require('cors')
const sequelize = require('./db')
const fileUpload = require('express-fileupload')
const models = require('./models/models')
const router = require('./routes')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(fileUpload({uploadTimeout: 0}))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

const httpServer = http.createServer(app)
const wss = new WebSocket.Server({
  'server': httpServer
})

wss.on('connection', function connection(ws) {
  ws.on('message', function (message) {
    message = JSON.parse(message)
    const room = message.room
    ws.id = room
    switch (message.event) {
      case 'message':
        broadcastMessage(message, room)
        break;
      case 'connection':
        broadcastMessage(message, room)
        break;
      case 'disconnect':
        broadcastMessage(message)
        break;
    }
  })
})

function broadcastMessage(message, room) {

  wss.clients.forEach(client => {
    if (message.event === 'disconnect') {
      console.log(message);
      client.send(JSON.stringify(message))
      return client.close()
    }
    if (!room) {
      return client.send(JSON.stringify(message))
    }

    if (client.id === room || client.id === room.split('-').reverse().join('-')) {
      client.send(JSON.stringify(message))
    }
  })
}

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    httpServer.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))

  } catch (error) {
    console.log(error);
  }
}

start()

