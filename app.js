/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    config = require('./config');
var app = express();
var jade = require('jade');
var mongoose = require('mongoose');
var model = require('./app/mod');
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({
    src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.get('/', function (req, res) {
    res.writeHead(200);
    var html = jade.renderFile('./views/index.jade');
    res.write(html);
    res.end();
});

app.get('/add', function (req, res) {
    res.writeHead(200);
    var html = jade.renderFile('./views/addmod.jade');
    console.log('Hey');
    res.write(html);
    res.end();
});
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
            var config = require('./config');
            var Mod = require('./app/mod');
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
app.get('/ajax/getmods/', function (req, res) {
    var limit = req.param('limit');
    var skip = req.param('skip');
    var sort = req.param('sort');

    var config = require('./config');

    var mod = require('./app/mod');
    var query = mod.find(null);
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
/*
app.get('/users', user.list);*/

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
