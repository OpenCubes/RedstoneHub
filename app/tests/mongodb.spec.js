describe("MongoDB", function() {
    var config = require('../config.js')
    it("is there a server running", function(next) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.db_uri, config.db_opt, function(err, db) {
            expect(err).toBe(null);
            next();
        });
    });
});