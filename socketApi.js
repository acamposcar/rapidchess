const socketIO = require('socket.io')
const io = socketIO()
const socketApi = {}
const Game = require('./models/game')
const gameController = require('./controllers/gameControllerSocket')

socketApi.io = io

io.on('connection', (socket) => {
  console.log('connected with id', socket.id)
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
  let interval

  interval = setInterval(async () => {
    const game = await Game.findById(gameId)
    io.to(gameId).emit('time', new Date())
  }, 500)

  socket.on("disconnect", (reason) => {
    clearInterval(interval)
  });

  socket.on('join-game', (gameId) => {
    io.to(gameId).emit('game-start')
  })

  socket.on('time-end', async (gameId) => {
    await Game.findByIdAndUpdate(gameId, { isOver: true }, {})
    io.to(gameId).emit('time-ended')
  })
})

module.exports = socketApi
