 var mongoose = require('mongoose'),
     config = require('../config'),
     Schema = mongoose.Schema;
 var db = mongoose.connect(config.db_uri, config.db_opt);
 if (!db) console.log('error while connecting');
 var modSchema = new mongoose.Schema({

     name: String,
     version: String,
     author: {
         type: Schema.Types.ObjectId,
         ref: 'userauths'
     },
     summary: String,
     description: String,
     logo: String,
     dl_id: String,
     creation_date: Date,
     lmodified_date: Date,
     category_id: {
         type: Schema.Types.ObjectId,
         ref: 'categories'
     },

     _stars_id: {
         type: Schema.Types.ObjectId,
         ref: 'stars'
     },

 });

 var categorySchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     name: String,
     slug: String
 });
 var starSchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     
     _user_id: {
         type: Schema.Types.ObjectId,
         ref: 'userauths'
     }
 });
 var passportLocalMongoose = require('./local');

 var User = new mongoose.Schema({});

 User.plugin(passportLocalMongoose);

 exports.user = db.model('userauths', User);
 exports.mod = db.model('mods', modSchema);
 exports.stars = db.model('stars', starSchema);
 exports.category = db.model('categories', categorySchema);
 exports.mongoose = Schema;