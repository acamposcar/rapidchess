const Game = require('../models/game')
const { Chess } = require('chess.js')

exports.updateGame = async (gameId, fen, lastMoveFrom, lastMoveTo, user) => {

  if (!fen || !lastMoveFrom || !lastMoveTo) {
    return res.status(400).json({
      error: 'Missing parameters'
    })
  }
  const game = await Game.findById(gameId)

  const update = {
    lastMoveFrom,
    lastMoveTo,
    lastMoveDate: new Date(),
    fen
  }
  let lastMoveDate
  if (game.lastMoveDate == undefined) {
    lastMoveDate = new Date()
  } else {
    lastMoveDate = game.lastMoveDate
  }
  const now = new Date()

  if (user === game.white) {
    update.whiteTime = new Date(now - lastMoveDate + game.whiteTime)
  } else {
    update.blackTime = new Date(now - lastMoveDate + game.blackTime)
  }

  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.gameId, update, { new: true })

    if (!updatedGame) {
      return res.status(404).json({
        error: 'No game found'
      })
    }

    return res.status(200).json(updatedGame)

  } catch (err) {
    return res.status(400).json({ error: err })
  }
}


