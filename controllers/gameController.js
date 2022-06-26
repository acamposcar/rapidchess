const Game = require('../models/game')
const { Chess } = require('chess.js')

exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.gameId).populate('white').populate('black')
    if (!game) {
      return res.status(404).json({
        error: 'No game found'
      })
    }
    return res.status(200).json({ game })
  } catch (err) {
    return next(err)
  }
}

exports.getAllGames = async (req, res, next) => {
  try {
    const games = await Game.find().sort({ startDate: -1 })
    return res.status(200).json({ games })
  } catch (err) {
    return next(err)
  }
}

exports.createGame = async (req, res, next) => {
  const chess = new Chess()
  let color

  if (req.body.color === 'random') {
    color = Math.random() > 0.5 ? 'white' : 'black'
  } else {
    color = req.body.color
  }

  try {
    const game = await new Game({
      creator: req.user._id,
      fen: chess.fen(),
      time: req.body.time,
      [color]: req.user._id
    }).save()
    return res.status(200).json({
      game
    })
  } catch (err) {
    return next(err)
  }
}

exports.updateGame = async (req, res, next) => {
  const chess = new Chess()
  chess.load(req.body.prevFen)

  const move = chess.move({
    from: req.body.from,
    to: req.body.to,
    promotion: 'q' // always promote to a queen for example simplicity
  })

  if (move === null) return res.status(200).json({ valid: false })

  const game = {
    fen: chess.fen()
  }

  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.gameId, game, { new: true })
    if (!updatedGame) {
      return res.status(404).json({
        error: 'No game found'
      })
    }
    return res.status(200).json({
      valid: true
    })
  } catch (err) {
    return next(err)
  }
}
