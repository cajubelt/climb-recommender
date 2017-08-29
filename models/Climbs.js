//should have name, grade, and crag

var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var climbSchema = Schema({
    name: String,
    crag: String,
    grade: String, //change this to float?
});

var climbModel = mongoose.model('Climb', climbSchema);

// helpers
var errorUtils = require('../utils/errorUtils');
// var Constants = require('../Constants');


var Climbs = (function(climbModel) {

    var that = {};


    Object.freeze(that);
    return that;

})(climbModel);

module.exports = Climbs;