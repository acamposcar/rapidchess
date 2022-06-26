const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/user')
const bcrypt = require('bcryptjs')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await User.findById(jwtPayload.sub)
      if (!user) {
        // User not found
        return done(null, false)
      }
      // User found. Injects user in req.user
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.use(
  new LocalStrategy({ session: false }, async (username, password, done) => {
    try {
      const user = await User.findOne({ username }).select('+password')
      if (!user) {
        // Incorrect username
        return done(null, false)
      }
      const passwordIsCorrect = await bcrypt.compare(password, user.password)
      if (passwordIsCorrect) {
        // Login OK
        return done(null, user)
      } else {
        // Incorrect password
        return done(null, false)
      }
    } catch (err) {
      return done(err)
    }
  })
)
