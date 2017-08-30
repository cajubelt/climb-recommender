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

//other models 
var Climbers = require('./Climbers.js');
var Climbs = require('./Climbs.js');


var Ascents = (function(ascentModel) {
    var that = {};

    that.addAscent = function(climber, climb, rec_status, stars_rating, date, callback){
    	if (!climber || !climb || !rec_status || !stars_rating || !date){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.findOne({climber: climber, climb: climb}, function(ascent){
    			if (ascent){
    				callback({msg: errorUtils.DuplicateAscent()});
    			} else {
    				var ascent_info = {
    					climber: climb, 
    					climb: climb, 
    					rec_status: rec_status, 
    					stars_rating: stars_rating, 
    					date: date,
    				};
    				var ascent = new ascentModel(ascent_info);
    				ascent.save(function(err, newAscent){
    					if (err) callback({msg: err});
    					else callback(null, newAscent);
    				});
    			}
    		});
    	}
    }

    that.getAscentById = function(ascentId, callback){
    	if (!ascentId){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.findOne({_id: ascentId}).populate({
    			path: 'climber',
    			model: 'Climber',
    		}).populate({
    			path: 'climb',
    			model: "Climb",
    		}).exec(function(err, ascentResult){
    			if (err) {
    				callback({msg:err});
    			} else {
    				callback(null, ascentResult);
    			}
    		});
    	}
    }

    //TODO test to see if ascents need to be populated with their info
    that.getAscentsByClimberId = function(climberId, callback){
    	if (!climberId){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.find({climber: climberId}).exec(function(err, ascentsResult){
    			if (err) callback({msg: err});
    			else callback(null, ascentsResult);
    		});
    	}
    }

    //TODO test to see if ascents need to be populated with their info
    that.getAscentsByClimbId = function(climbId, callback){
    	if (!climb){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.find({climber:climberId}).exec(function(err, ascentsResult){
    			if (err) callback({msg: err});
    			else callback(null, ascentsResult);
    		});
    	}
    }

    Object.freeze(that);
    return that;

})(ascentModel);

module.exports = Ascents;