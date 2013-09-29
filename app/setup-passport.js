var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var config = require('../config')
var strategy = new Auth0Strategy({
    domain: config.domain,
    clientID: config.secret,
    clientSecret: config.secret,
    callbackURL: '/user'
}, function (accessToken, refreshToken, profile, done) {
    //Some tracing info
    console.log('profile is', profile);
    return done(null, profile);
});

passport.use(strategy);

// This is not a best practice, but we want to keep things simple for now
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = strategy;