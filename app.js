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
var schemas = require('./app/schemas');
var model = require('./app/model');

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
    console.log('Hey');
    res.write(html);
    res.end();
});
app.get('/getmods/:limit/:skip', function (req, res) {
    var limit = req.params.limit;
    var skip = req.params.skip;

    mongoose.connect(config.db_connection, function (err) {
        if (err) {
            throw err;
        }
    });
    var ModModel = mongoose.model('mods', schemas.modScheme);
    var query = model.ModModel.find(null);
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    query.exec(function (err, mods) {
        if (err) {
            throw err;
        }
        console.log('Retriveing mods...');
        res.send(mods);
    });
    mongoose.connection.close();
    res.end();

});
/*
app.get('/users', user.list);*/

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
