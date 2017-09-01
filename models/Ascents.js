var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var ascentSchema = Schema({
    climber: {type: Schema.ObjectId, ref: 'Climber'},
    climb: {type: Schema.ObjectId, ref: 'Climb'},
    rec_status: Boolean,
    stars_rating: Number,
    date: Date,
    ascent_type: String, //mapped to strings in Constants.js
    notes: String,
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

    that.addAscent = function(climber, climb, rec_status, stars_rating, date, ascent_type, notes, callback){
    	if (!climber || !climb || !(typeof(rec_status) =='boolean') || !date || !ascent_type || !(typeof(stars_rating) == 'number' || !notes)){
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
    					ascent_type: ascent_type,
    				};
    				var ascent = new ascentModel(ascent_info);
    				ascent.save(function(err, newAscent){
    					if (err) callback(err);
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
    				callback(err);
    			} else {
    				callback(null, ascentResult);
    			}
    		});
    	}
    }

    //TODO test to see if ascents need to be populated with their info
    that.getAscentsByClimber = function(climber, callback){
    	if (!climber){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.find({climber: climber}).exec(function(err, ascentsResult){
    			if (err) callback(err);
    			else callback(null, ascentsResult);
    		});
    	}
    }

    //TODO test to see if ascents need to be populated with their info
    that.getAscentsByClimb = function(climb, callback){
    	if (!climb){
    		callback({msg: errorUtils.InvalidInputs()});
    	} else {
    		ascentModel.find({climb:climb}).exec(function(err, ascentsResult){
    			if (err) callback(err);
    			else callback(null, ascentsResult);
    		});
    	}
    }

    Object.freeze(that);
    return that;

})(ascentModel);

module.exports = Ascents;