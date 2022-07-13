const mongoose = require('mongoose')

const { Schema } = mongoose

const GameSchema = new Schema(
  {
    creator: { type: String },
    white: { type: String },
    black: { type: String },
    pgn: { type: String },
    fen: { type: String },
    winner: { type: String },
    lastMoveFrom: { type: String },
    lastMoveTo: { type: String },
    startDate: { type: Date },
    lastMoveDate: { type: Date },
    whiteTime: { type: Number, default: 0 },
    blackTime: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    isOver: { type: Boolean, default: false },
    duration: { type: Number, default: 60 },
    colorMode: { type: String }
  }, { timestamps: true }
)

// Export model
module.exports = mongoose.model('Game', GameSchema)
