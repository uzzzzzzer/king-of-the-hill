/**
 * This is the server app script that is run on the server.
 * @author alvin@omgimanerd.tech (Alvin Lin)
 */

const PORT = process.env.PORT || 5000
const FRAME_RATE = 1000 / 60
const CHAT_TAG = '[King of the hill]'

// Dependencies.
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const path = require('path')
const socketIO = require('socket.io')

const Game = require('./server/Game')

const Constants = require('./lib/Constants')

// Initialization.
const app = express()
const server = http.Server(app)
const io = socketIO(server)
//const game = new Game()
var games = [new Game()]
var sockets = new Map()

app.set('port', PORT)

app.use(morgan('dev'))
app.use('/client', express.static(path.join(__dirname, '/client')))
app.use('/dist', express.static(path.join(__dirname, '/dist')))

// Routing
app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname, 'views/index.html'))
})

/**
 * Server side input handler, modifies the state of the players and the
 * game based on the input it receives. Everything runs asynchronously with
 * the game loop.
 */
io.on('connection', socket => {
  socket.on(Constants.SOCKET_NEW_PLAYER, (data, callback) => {
    let game = games[games.length - 1]
    let nm = data.name + "(" + [...game.players.values()].length + ")"
    game.addNewPlayer(nm, socket)
    sockets.set(socket.id, games.length - 1)
    if([...game.players.values()].length >= Constants.PLAYERS_IN_ROOM){
      games.push(new Game())
    }
    game.clients.forEach((client, socketID) => {game.clients.get(socketID).emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
      name: CHAT_TAG,
      message: `${nm} has joined the game.`,
      isNotification: true
    })
    })
    callback()
  })

  socket.on(Constants.SOCKET_PLAYER_ACTION, data => {
    if(typeof sockets.get(socket.id) != 'undefined'){
      let game = games[sockets.get(socket.id)]
      game.updatePlayerOnInput(socket.id, data)
    }
    else{
      //console.log([...sockets.keys()], socket.id)
    }
  })

  socket.on(Constants.SOCKET_CHAT_CLIENT_SERVER, data => {
    if(typeof sockets.get(socket.id) != 'undefined'){
      let game = games[sockets.get(socket.id)]
      game.clients.forEach((client, socketID) => {game.clients.get(socketID).emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
        name: game.getPlayerNameBySocketId(socket.id),
        message: data
    })
   })
    }
  })

  socket.on(Constants.SOCKET_DISCONNECT, () => {
    if(typeof sockets.get(socket.id) != 'undefined'){
      let game = games[sockets.get(socket.id)]
      const name = game.removePlayer(socket.id)
      game.clients.forEach((client, socketID) => {game.clients.get(socketID).emit(Constants.SOCKET_CHAT_SERVER_CLIENT, {
        name: CHAT_TAG,
        message: ` ${name} has left the game.`,
        isNotification: true
      })
      })
    }
 })
})

/**
 * Server side game loop, runs at 60Hz and sends out update packets to all
 * clients every update.
 */
setInterval(() => {
  for(var i = 0; i < games.length; i++){
    let game = games[i]
    if(!game.full){
      game.checkIfFull()
    }
    if(game.full){
      game.update()
      game.sendState()
    }
    if(game.finished){
      var ps = [...game.players.keys()]
      for(var j = 0; j < ps.length; j++){
        if(sockets.get(ps[j]) <= i){
          sockets.delete(ps[j])
        }
        if(sockets.get(ps[j]) > i){
          sockets.set(ps[j], sockets.get(ps[j]) - 1)
        }
      }
      games.splice(i, 1)
    }
  }
}, FRAME_RATE)

// Starts the server.
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Starting server on port ${PORT}`)
})
