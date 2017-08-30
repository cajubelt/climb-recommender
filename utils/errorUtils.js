var error_utils = (function() {

    var that = {};

    //already exists (creating a new Climber in the database)
    that.DuplicateClimber = function() {
        return "A climber already exists with the information provided.";
    }

    //invalid inputs
    that.InvalidInputs = function(){
        return "Invalid inputs provided for the database query."
    }

    Object.freeze(that);
    return that;
})();

module.exports = error_utils;