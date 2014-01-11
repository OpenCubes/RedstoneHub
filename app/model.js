 var mongoose = require('mongoose'),
     config = require('../config'),
     Schema = mongoose.Schema;
 var db = mongoose.connect(config.db_uri, config.db_opt);
 if (!db) console.log('error while connecting');
 

  var starSchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     userid: Schema.Types.ObjectId,
     
 });
 var  fileSchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     version: Schema.Types.ObjectId,
     path: String,
     
 }); 
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
     voters: [starSchema],
     vote_count: Number,
     versions: [versionSchema],
     slug: String

 });

 var categorySchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     name: String,
     slug: String
 });
 var versionSchema = new mongoose.Schema({
     _id: Schema.Types.ObjectId,
     name: String
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

 exports.user = exports.User = db.model('userauths', User);
 exports.mod = exports.Mod = db.model('mods', modSchema);
 exports.stars = exports.Stars = db.model('stars', starSchema);
 exports.category = exports.Category = db.model('categories', categorySchema);
 exports.files = exports.Files = db.model('files', fileSchema);
 exports.mongoose = mongoose;