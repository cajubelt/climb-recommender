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

 	that.addClimb = function(name, crag, grade, callback){
 		if (!name || !crag || !grade){
 			callback({msg: errorUtils.InvalidInputs()});
 		} else {
 			var climb_info = {name: name, grade: grade, crag: crag};
 			climbModel.findOne(climb_info, function(climb){
 				if (climb){
 					callback({msg: errorUtils.DuplicateClimb()});
 				} else {
 					var climb = new climbModel(climb_info);
 					climb.save(function(err, newClimb){
 						if (err) callback({msg: err});
 						else callback(null, newClimb);
 					});
 				}
 			});
 		}
 	}

 	// that.getClimbById = function(id, callback){
 	// 	//TODO implement
 	// }

    Object.freeze(that);
    return that;

})(climbModel);

module.exports = Climbs;