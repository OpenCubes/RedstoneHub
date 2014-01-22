module.exports = function(db) {
    this.db = db;
};
module.exports.prototype = {
    extend: function(properties) {
        var Child = module.exports;
        Child.prototype = module.exports.prototype;
        for(var key in properties) {
            Child.prototype[key] = properties[key];
        }
        return Child;
    },
    setDB: function(db) {
        this.db = db;
    },
    get: function(callback){
         var query = object.find(null);
                if (category_id) query.where('category_id', category_id);
                query.limit(limit).skip(skip).sort(sort).select('name summary category_id creation_date _id slug');
                query.exec(function(err, doc) {
                    if (err) {
                        throw err;
                    }
                    else {
                        res.send(doc);
                    }
                });
    },
    list: function(callback){
        
    },
    // Update the model
    update: function(data, callback){
        
    },
    store: function(callback){
        
    },
    drop: function(callback){
        
    }
}