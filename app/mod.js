 var mongoose = require('mongoose'),
     config = require('../config');
 var db = mongoose.connect(config.db_uri, config.db_opt);
 if (!db) console.log('error while connecting');
 var modSchema = new mongoose.Schema({

         _id: Object,
         name: String,
         version: String,
         author_id: Object,
         summary: String,
         description: String,
         version: String,
         logo: String,
         dl_id: String,
         creation_date: Date,
         lmodified_date: Date,


     });



 module.exports = db.model('mods', modSchema);