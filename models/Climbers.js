var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var climberSchema = Schema({
    name: String,
    
    //extra profile info:
    city: String,
    country: String,
    birthday: String,
    height: String,
    weight: String,
    started_climbing: String,
    occupation: String,
    other_interests: String,
    best_comp_result: String,
    best_climbing_area: String,
    sponsor_links: String,
    is_female: Boolean,
});

var climberModel = mongoose.model('Climber', climberSchema);

// helpers
var errorUtils = require('../utils/errorUtils');
// var Constants = require('../Constants');


var Climbers = (function(climberModel) {

    var that = {};

    Object.freeze(that);
    return that;

})(climberModel);

module.exports = Climbers;