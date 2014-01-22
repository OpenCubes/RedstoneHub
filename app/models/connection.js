module.exports = function(config, callback){
    var MongoClient = require('mongoose').client;
    MongoClient.connect(config.db_uri, config.db_opt, function(err, db) {
    if(err) {
        console.log('\n   Sorry, there is no MongoDB server running.\n'.red);
    } else {
       return callback(db);
    }
});
}