var error_utils = (function() {

    var that = {};

    //already exists (creating a new Climber in the database)
    that.DuplicateClimber = function() {
        return "A climber already exists with the information provided.";
    }

    //climb already exists with that name, grade, and crag
    that.DuplicateClimb = function(){
        return "A climb already exists with the information provided.";
    }

    //ascent already exists with that climber and climb
    that.DuplicateAscent = function(){
        return "An ascent already exists with the information provided.";
    }

    //invalid inputs
    that.InvalidInputs = function(){
        return "Invalid inputs provided for the database query."
    }

    //no climber with that name
    that.ClimberlessName = function(){
        return "No climber with that name was found in the database."
    }

    //no 8a user with that name
    that.userlessName = function(){
        return "No climber with that name was found on 8a.nu."
    }

    that.unexpectedError = function(){
        return "An unexpected error occurred."
    }

    that.NoAscentsByClimber = function(){
        return "No ascents by that climber found in the database."
    }


    Object.freeze(that);
    return that;
})();

module.exports = error_utils;