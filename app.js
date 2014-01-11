/**
 * Module dependencies.
 */
var express = require('express'),
    connect = require('connect'),
    app = express(),
    routes = require('./routes'),
    user = require('./routes/user'),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    path = require('path'),
    config = require('./config'),
    jade = require('jade'),
    model = require('./app/model'),
    status = require('json-status'),
    util = require('util'),
    fs = require('fs'),
    sessionStore = new connect.middleware.session.MemoryStore(),
    Mod = model.mod,
    User = model.user,
    Category = model.category,
    Stars = model.stars,
    Files = model.files,
    crypto = require('crypto'),
    cookieParser = express.cookieParser(config.secret),
    shasum = crypto.createHash('sha256'),
    lessMiddleware = require('less-middleware'),
    $1 = require('./dollar.js'),
    passport = require('passport'),
    archive = require('archiver'),
    uuid = require('uuid');
    
// Upload/edit mods routes
var modmanager = require('./app/modmanager.js')(model, archive, fs),
    // User management routes (login, logout, register...)
    usermanager = require('./app/usermanager.js')(model, $1, uuid),
    // Mod fetcher (getmods, info...)
    fetchmanager = require('./app/fetchmanager.js')(model);
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// Middelwares
var responseSent = false;
var errorEventSent = false;
var statusMiddleware = status.connectMiddleware('status', function(data) {
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
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(lessMiddleware({
    src: __dirname + "/less",
    dest: __dirname + "/public/css",
    // if you're using a different src/dest directory, you
    // MUST include the prefex, which matches the dest
    // public directory
    prefix: "/css",
    // force true recompiles on every request... not the
    // best for production, but fine in debug while working
    // through changes
    //force: true
}));

app.use(express.static(__dirname + '/public'));
// Router
app.use(app.router);

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, express.cookieParser(config.secret));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
var index = function(req, res) {
    console.log('req' + req.user)
    res.render('index', {
        user: req.user,
        logged: (req.user ? true : false),
        title: 'Homepage'
    });
};
// INDEX
app.get('/:var((browse((/*)?))|upload)?', index);
app.get('/view/:id', index);
app.get('/edit/:id', index);
app.get('/register', index);

app.post('/register', usermanager.register);

app.get('/shape', usermanager.shape);
app.post('/isbot', usermanager.isbot);
app.get('/login', function(req, res) {

    res.render('login', {
        user: req.user
    });
});
/*
app.post('/login' , function (req, res) {
    console.log("logging in...");
    passport.authenticate('local');
});*/

app.get('/ajax/logout', function(req, res) {
    req.logout();
    res.send('');
});
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

app.post('/login', passport.authenticate('local', {}), function(req, res) {
    res.send({
        user: req.user
    });
});

app.get('/isauth', function(req, res) {
    res.send({
        user: req.user
    });
});
// AJAX
// AJAX
// AJAX ROUTE FOR ADDING MOD
app.post('/ajax/addmod/', modmanager.upload);

// AJAX ROUTE FOR GETTING MODS
app.get('/ajax/getmods/', fetchmanager.getmods);
// AJAX ROUTE FOR VIEWING MOD
app.get('/ajax/info/', fetchmanager.info);

// AJAX ROUTE FOR STARRING MOD
app.get('/ajax/star/', modmanager.star);
// AJAX ROUTE FOR MANAGING FILE
app.get('/ajax/files/manage/', modmanager.managefiles);

app.get('/pack/', modmanager.pack);


require('./app/socket.js')(sessionSockets, config.uploadPacketSize, fs, model, Mod, User, uuid);


server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
