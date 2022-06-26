const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController')
const isAuth = require('../middleware/auth').isAuth

router.route('/:gameId').get(gameController.getGame).put(isAuth, gameController.updateGame)
router.route('/').get(gameController.getAllGames).post(isAuth, gameController.createGame)

module.exports = router
