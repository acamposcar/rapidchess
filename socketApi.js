const socketIO = require('socket.io')
const io = socketIO()
const socketApi = {}
const Game = require('./models/game')
const gameController = require('./controllers/gameControllerSocket')

socketApi.io = io
const MS_TO_SEC = 1000
const MIN_TO_SEC = 60
setInterval(async () => {
  io.emit('time-now', new Date())
}, 500)

io.on('connection', (socket) => {

  const gameId = socket.handshake.query.gameId
  socket.join(gameId)
  console.log('room', gameId)

  socket.on('join-room', (recipientId) => {
    socket.join(recipientId)
  })

  socket.on('move', (gameId, fen, lastMoveFrom, lastMoveTo) => {
    io.to(gameId).emit('invalidate-query', fen, lastMoveFrom, lastMoveTo)
    // gameController.updateGame(gameId, fen, lastMoveFrom, lastMoveTo, user)
  })

  socket.on('join-game', (gameId) => {
    io.to(gameId).emit('game-start')
  })

  socket.on('check-time-end', async (gameId) => {
    const game = await Game.findById(gameId)
    const update = { isOver: true }

    if (game.turn = 'b') {
      update.whiteTime = game.duration * MIN_TO_SEC * MS_TO_SEC
    } else {
      update.blackTime = game.duration * MIN_TO_SEC * MS_TO_SEC
    }

    await Game.findByIdAndUpdate(gameId, update, {})
    io.to(gameId).emit('time-ended')
  })
})

module.exports = socketApi
