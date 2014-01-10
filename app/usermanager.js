var humanList = [], shapes = [];
module.exports = function(model, $1, uuid) {
    var routes = {};
    routes.shape = function(req, res) {

        // sort a random shape for the captcha and save it on the session
        var shapes = ['triangle', 'x', 'rectangle', 'circle', 'check', 'caret', 'zigzag', 'arrow', 'leftbracket', 'rightbracket', 'v', 'delete', 'star', 'pigtail'];
        var shape = shapes[Math.floor(Math.random() * (shapes.length))];
        req.session.shape = shape;

        res.send(shape);
    };
    routes.isbot = function(req, res) {

        // require $1 Unistroke Recognizer
        var
        points = req.param('_points') // get the points submitted on the hidden input
        ,
            _points_xy = points.split('|'),
            _points = [];

        // convert to an array of Points
        for (p in _points_xy) {
            var xy = _points_xy[p].split(',');
            _points.push(new $1.Point(parseInt(xy[0]), parseInt(xy[1])));
        }

        // test the points
        var _r = new $1.DollarRecognizer();
        var result = _r.Recognize(_points);

        // validates the captcha or redirect
        if (_points.length >= 10 && result.Score > 0.7 && result.Name == req.session.shape) {
            var d = uuid.v4();
            res.cookie('human-id', d, {
                httpOnly: false
            });
            res.cookie('isbot', 'no', {
                httpOnly: false
            });
            humanList.push(d);
            console.log(d);
            res.send({
                status: 'ok'
            });
            1
        }
        else {
            res.send({
                status: 'invalid'
            });
        }

    };
    routes.register = function(req, res) {
        var hid = req.cookies['human-id'] || '';
        if (humanList.indexOf(hid) != -1) {
            console.log(req.body);
            model.User.register(new model.User({
                username: req.body.username,
                email: req.body.email
            }), req.body.password, function(err, account) {
                if (err) {
                    return res.send({
                        status: 'error'
                    });
                }
                res.send({
                    status: 'done'
                });
            });
        }
        else {
            res.send({
                status: 'error',
                type: 'bot'
            });
        }
    }
    return routes;
}