const mongoose = require('mongoose')

const { Schema } = mongoose

const GameSchema = new Schema(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    white: { type: Schema.Types.ObjectId, ref: 'User' },
    black: { type: Schema.Types.ObjectId, ref: 'User' },
    pgn: { type: String },
    fen: { type: String },
    winner: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: { type: Date },
    active: { type: Boolean, default: true },
    time: { type: Number, default: 60 }
  }
)

// Export model
module.exports = mongoose.model('Game', GameSchema)
