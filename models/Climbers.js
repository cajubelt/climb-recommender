var mongoose = require('mongoose')
    , Schema = mongoose.Schema;
// var _ = require('underscore');

var climberSchema = Schema({
    name: {type: String, required: true},
    is_female: {type: Boolean, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    eightA_user_id: {type: String, required: true},
    
    //optional profile info:
    birthday: String,
    height: String,
    weight: String,
    started_climbing: String,
    occupation: String,
    other_interests: String,
    best_comp_result: String,
    best_climbing_area: String,
    can_guide_areas: String,
    sponsor_links: String,
});

var climberModel = mongoose.model('Climber', climberSchema);

// helpers
var errorUtils = require('../utils/errorUtils');
// var Constants = require('../Constants');


var Climbers = (function(climberModel) {

    var that = {};

    that.addClimber = function(climber_info_json, callback){
        // if (!name || !city || !country || !(typeof(is_female) == 'boolean') || !8a_user_id || !optional_info){
        //     callback({msg: errorUtils.InvalidInputs()});
        // } else {
        climberModel.findOne({eightA_user_id: climber_info_json.eightA_user_id}, function(err, climber){
            if (climber){
                callback({msg: errorUtils.DuplicateClimber()});
            } else {
                var climber_info = JSON.parse(JSON.stringify(climber_info_json));
                // climber_info.name = name;
                // climber_info.is_female = is_female;
                // climber_info.city = city;
                // climber_info.country = country;
                // climber_info.8a_user_id = 8a_user_id;
                var climber = new climberModel(climber_info);
                climber.save(function(err, newClimber){
                    if (err) callback({msg: err});
                    else callback(null, newClimber);
                });
            }
        });
    }   

    that.getClimberByName = function(name, callback){
        if (!name) {
            callback({msg: errorUtils.InvalidInputs()});
        } else {
            console.log('looking for climber by name');
            //TODO handle situation where multiple climbers have same name
            climberModel.findOne({name: name}).exec(function(climber){
                if (!climber){
                    console.log('no climber found with that name');
                    callback({msg:errorUtils.ClimberlessName()});
                } else {
                    console.log('climber found');
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