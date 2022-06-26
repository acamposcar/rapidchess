const socketIO = require('socket.io')
const io = socketIO()
const socketApi = {}

socketApi.io = io

let interval

io.on('connection', (socket) => {
  console.log('New client connected')
  if (interval) {
    clearInterval(interval)
  }
  socket.on('move', (movement) => {
    socket.broadcast.emit('move', movement)
  })
  interval = setInterval(() => getApiAndEmit(socket), 1000)
  socket.on('disconnect', () => {
    console.log('Client disconnected')
    clearInterval(interval)
  })
})

const getApiAndEmit = socket => {
  const response = new Date()
  // Emitting a new message. Will be consumed by the client
  socket.emit('FromAPI', response)
}

module.exports = socketApi
