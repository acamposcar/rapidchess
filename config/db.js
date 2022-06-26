const mongoose = require('mongoose')

const connectDB = () => {
  mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}

module.exports = connectDB
