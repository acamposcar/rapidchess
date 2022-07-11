const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController')

router.route('/:gameId').get(gameController.getGame).put(gameController.updateGame).post(gameController.joinGame)
router.route('/').get(gameController.getAllGames).post(gameController.createGame)

module.exports = router
