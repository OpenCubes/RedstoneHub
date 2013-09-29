/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config'),
    app = express(),
    jade = require('jade'),
    model = require('./app/model'),
    Mod = model.mod,
    User = model.user,
    LocalStrategy = require("passport-local").Strategy;
var lessMiddleware = require('less-middleware');

var passport = require('passport');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
// Middelwares

// Express
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser(config.secret));
app.use(express.session({
    secret: config.secret
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
    force: true
}));

app.use(express.static(__dirname + '/public'));
// Router
app.use(app.router);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
//
// INDEX
app.get('/', function (req, res) {
    console.log('req'+req.user)
    res.render('index', {
        user: req.user,
        logged: (req.user ? true : false)
    });
});
// ADD MOD
app.get('/add', function (req, res) {
    res.writeHead(200);
    var html = jade.renderFile('./views/addmod.jade');
    res.write(html);
    res.end();
});

// LOGIN


app.get('/register', function (req, res) {
    res.render('register', {});
});

app.post('/register', function (req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render('register', {
                account: account
            });
        }

        res.redirect('/');
    });
});

app.get('/login', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


/*
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });*/
// AJAX

// AJAX ROUTE FOR ADDING MOD
app.post('/ajax/addmod/', function (req, res) {
    var enforce = require("enforce");
    var form = JSON.parse(req.body.form);
    console.log(form);
    var name = form.name,
        sum = form.sum,
        desc = form.desc,
        version = form.version,
        logo = form.logo,
        dl_link = form.dl_link;

    var checks = new enforce.Enforce({
        returnAllErrors: true
    });
    checks.add("name", enforce.notEmptyString('Name invalid')).add("name", enforce.ranges.length(2, undefined, "Name is too short")) // yes, you can have multiple validators per property
    .add("version", enforce.patterns.match(config.version_regex, undefined, 'Version is invalid')).add("sum", enforce.notEmptyString('Summary is invalid')).add("desc", enforce.notEmptyString('Description is invalid'));
    checks.check({
        name: name,
        sum: sum,
        desc: desc,
        version: version,
        logo: logo,
        dl_link: dl_link

    },

    function (err) {
        if (!err) {
            var document = {
                name: name,
                summary: sum,
                description: desc,
                version: version,
                logo: logo,
                dl_link: dl_link,
                creation_date: Date.now()
            };
            var doc = new Mod(document);
            doc.save(function (err) {
                if (err) {
                    throw err;
                }
                res.send({});
            });
        }
        else {
            console.log(err);
            res.send(err);
        }
    });
});

// AJAX ROUTE FOR GETTING MODS
app.get('/ajax/getmods/', function (req, res) {
    var limit = req.param('limit');
    var skip = req.param('skip');
    var sort = req.param('sort');

    var config = require('./config');

    var query = Mod.find(null);
    query.limit(limit).skip(skip).sort(sort);
    // peut s'ecrire aussi query.where('pseudo', 'Atinux').limit(3);
    query.exec(function (err, doc) {
        if (err) {
            throw err;
        }
        else {
            res.send(doc);
        }
    });

});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
