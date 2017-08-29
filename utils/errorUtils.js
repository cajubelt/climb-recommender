var error_utils = (function() {

    var that = {};

    //already exists (creating a new account)
    // that.DuplicateAccount = function() {
    //     return "An account already exists for this email address.";
    // }

    Object.freeze(that);
    return that;
})();

module.exports = error_utils;