var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var climberSchema = Schema({
    name: String, //{type: String, required: true}
    is_female: Boolean,
    city: String,
    country: String,
    
    //optional profile info:
    birthday: String,
    height: String,
    weight: String,
    started_climbing: String,
    occupation: String,
    other_interests: String,
    best_comp_result: String,
    best_climbing_area: String,
    sponsor_links: String,
});

var climberModel = mongoose.model('Climber', climberSchema);

// helpers
var errorUtils = require('../utils/errorUtils');
// var Constants = require('../Constants');


var Climbers = (function(climberModel) {

    var that = {};

    that.addClimber = function(name, is_female, city, country, optional_info, callback){
        if (!name || !city || !country || !optional_info){
            callback({msg: errorUtils.InvalidInputs()});
        } else {
            climberModel.findOne({name:name, is_female: is_female, city: city, country: country}, function(err, climber){
                if (climber){
                    //TODO check additional details about the climber against the potential duplicate
                    callback({msg: errorUtils.DuplicateClimber()});
                } else {
                    var climber_info = JSON.parse(JSON.stringify(optional_info));
                    climber_info.name = name;
                    climber_info.is_female = is_female;
                    climber_info.city = city;
                    climber_info.country = country;
                    var climber = new climberModel(climber_info);
                    climber.save(function(err, newClimber){
                        if (err) callback({msg: err});
                        else callback(null, newClimber);
                    });
                }
            });
        }
    }

    that.getClimberByName = function(name, callback){
        if (!name) {
            callback({msg: errorUtils.InvalidInputs()});
        } else {
            climberModel.findOne({name: name}, function(climber){
                if (!climber){
                    callback({msg:errorUtils.ClimberlessName()});
                } else {
                    callback(null, climber);
                }
            });
        }
    }

    // that.getClimberById = function(climber_id, callback){
    //     //TODO implement me
    // }

    Object.freeze(that);
    return that;

})(climberModel);

module.exports = Climbers;