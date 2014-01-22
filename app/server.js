/**
 * Module dependencies.
 */
var express = require('express'),
    connect = require('connect'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    config = require('./config'),
    jade = require('jade'),
    jstatus = require('json-status'),
    sessionStore = new connect.middleware.session.MemoryStore(),
    crypto = require('crypto'),
    cookieParser = express.cookieParser(config.secret),
    lessMiddleware = require('less-middleware'),
    passport = require('passport'),
    colors = require('colors'),
    connection = require('./models/connection');

connection(function(db) {

    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    // Middelwares
    var responseSent = false;
    var errorEventSent = false;
    var statusMiddleware = jstatus.connectMiddleware('status', function(data) {
        console.log("error: ", data.type, data.message, data.detail);
    });
    app.use(statusMiddleware);

    // Express
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(cookieParser);
    app.use(express.session({
        store: sessionStore
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    // use static authenticate method of model in LocalStrategy
    // passport.use(User.createStrategy());
    // passport.serializeUser(User.serializeUser());
    // passport.deserializeUser(User.deserializeUser());

    app.use(lessMiddleware({
        src: __dirname + "/less",
        dest: __dirname + "/public/css",
        prefix: "/css",
        // force true recompiles on every request
        force: config.env === 'dev'
    }));
    app.use(connect.compress());

    //if(config.env === 'production')
    app.use(require('express-minify')());
    app.use(express.static(__dirname + '/public'));

    // Middleware for attaching db
    app.use(function(req, res, next) {
        req.db = db;
        next();
    });

    // Router
    app.use(app.router);

    var SessionSockets = require('session.socket.io'),
        sessionSockets = new SessionSockets(io, sessionStore, express.cookieParser(config.secret));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
})
