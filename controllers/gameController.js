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
    return res.status(200).json(game)
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
      creator: req.body.token,
      fen: chess.fen(),
      duration: req.body.duration,
      [color]: req.body.token,
      colorMode: req.body.color
    }).save()
    return res.status(200).json({
      game
    })
  } catch (err) {
    return next(err)
  }
}

// exports.updateGame = async (req, res, next) => {
//   const chess = new Chess()
//   chess.load(req.body.prevFen)

//   const move = chess.move({
//     from: req.body.from,
//     to: req.body.to,
//     promotion: 'q' // always promote to a queen for example simplicity
//   })

//   if (move === null) return res.status(200).json({ valid: false })

//   const game = {
//     fen: chess.fen()
//   }

//   try {
//     const updatedGame = await Game.findByIdAndUpdate(req.params.gameId, game, { new: true })
//     if (!updatedGame) {
//       return res.status(404).json({
//         error: 'No game found'
//       })
//     }
//     return res.status(200).json({
//       valid: true
//     })
//   } catch (err) {
//     return next(err)
//   }
// }

exports.updateGame = async (req, res, next) => {
  const fen = req.body.fen
  const lastMoveFrom = req.body.lastMoveFrom
  const lastMoveTo = req.body.lastMoveTo
  const user = req.body.user
  if (!fen || !lastMoveFrom || !lastMoveTo) {
    return res.status(400).json({
      error: 'Missing parameters'
    })
  }
  const game = await Game.findById(req.params.gameId)

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
    update.turn = 'b'
  } else {
    update.blackTime = new Date(now - lastMoveDate + game.blackTime)
    update.turn = 'w'
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
    return next(err)
  }
}


exports.joinGame = async (req, res, next) => {
  const userId = req.body.user
  const gameId = req.params.gameId
  if (!userId) {
    return res.status(400).json({
      error: 'Missing userId'
    })
  }

  try {
    const game = await Game.findById(gameId)
    let newPlayerColor
    if (game.white && game.black) {
      return res.status(400).json({
        error: "Can't join the game"
      })
    } else if (game.white) {
      newPlayerColor = 'black'
    } else {
      newPlayerColor = 'white'
    }
    const updatedGame = await Game.findByIdAndUpdate(gameId, { [newPlayerColor]: userId }, { new: true })

    if (!updatedGame) {
      return res.status(404).json({
        error: 'No game found'
      })
    }

    return res.status(200).json(updatedGame)
  } catch (err) {
    return next(err)
  }
}



