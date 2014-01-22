var BaseController = require("./base"),
        View = require("../views/base"),
        model = new (require("../models/content.model"));
module.exports = BaseController.extend({
    name: "Frontend",
    content: null,
    run: function(req, res, next) {
        model.setDB(req.db);
        var self = this;
        this.getContent(function() {
            var v = new View(res, 'home');
            v.render(self.content);
        })
    },
    getContent: function(callback) {
        var self = this;
        this.content = {};
        model.getlist(function(err, records) {
            model.getlist(function(err, records) {
                callback();
            }, { type: 'blog' });
        }, { type: 'home' });
    }
});