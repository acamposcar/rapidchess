const { Chess } = require('chess.js')
const express = require('express')
const router = express.Router()
const socketApi = require('../socketApi')

const io = socketApi.io

let fen = ''
/* GET home page. */
router.get('/', function (req, res, next) {
  const chess = new Chess()
  return res.status(200).json({ data: fen })
})
const history = []

router.post('/validate', function (req, res, next) {
  const chess = new Chess()
  chess.load(req.body.prevFen)
  const move = chess.move({
    from: req.body.from,
    to: req.body.to,
    promotion: 'q' // always promote to a queen for example simplicity
  })
  if (move === null) return res.status(200).json({ data: false })
  fen = chess.fen()
  history.push(chess.pgn())

  return res.status(200).json({ data: true })
})

router.get('/game', function (req, res, next) {
  const chess = new Chess()
  if (fen) {
    return res.status(200).json({ fen })
  }
  return res.status(200).json({ fen: chess.fen() })
})

module.exports = router
