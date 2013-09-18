var mongoose = require('mongoose');
exports.modScheme = new mongoose.Schema({

    _id: Object,
    name: {
        type: String,

    },
    summary: String,
    description: String,
    version: String,
    logo: String,
    dl_link: String,
    creation_date: {
        type: Date,
        default: Date.now
    },
    lmodified_date: {
        type: Date,
        default: Date.now
    }


});