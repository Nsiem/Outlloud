const passport = require('passport')
const mongoose = require('mongoose')
const users = require('../models/users')
const passportJWT = require('passport-jwt')
const cfg = require('./config')
const e = require('express')
const ExtractJwt = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}
const authenticate_params = {
    session: false,
    failureRedirect: '/login'
}
const maxage = 86400000

module.exports = function() {
    const strategy = new Strategy(params, function(payload, done) {
        var datemilli = new Date()
        var diff = Math.abs(datemilli.getTime() - payload.age)
        
        if (diff > maxage) {
            return done(null, false, {message: 'Token is expired.'})
        }
        users.findOne({username: payload.username}).then((result) => {
            if (result == null) return done(null, false, {message: 'Account does not exist'})
            if (result.password == payload.password) {
                const userObj = result.toObject()
                delete userObj.password
                return done(null, userObj)

            } else {
                console.log('Incorrect password.')
               return done(null, false, {message: 'Incorrect password.'})
            }
        }).catch((err) => {
            console.log('No user')
            return done(null, false, {message: 'No user found.'})
        })
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", authenticate_params);
        }
    };
};