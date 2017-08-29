var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var ascentSchema = Schema({
    climber: {type: Schema.ObjectId, ref: 'Climber'},
    climb: {type: Schema.ObjectId, ref: 'Climb'},
    rec_status: Boolean,
    stars_rating: Number,
    date: Date,
});

var ascentModel = mongoose.model('Ascent', ascentSchema);

// helpers
var errorUtils = require('../utils/errorUtils');
// var Constants = require('../Constants');


var Ascents = (function(ascentModel) {
    var that = {};


    Object.freeze(that);
    return that;

})(ascentModel);

module.exports = Ascents;