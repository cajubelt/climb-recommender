// Packaged utility functions.
//
// These methods abstract out the basic mechanism
// of creating server responses with some content
// (error code, message, etc.).
//
// Used verbatim from the notes app. Many thanks and appreciates.
var utils = (function() {

    var _utils = {};


    /**
     Send an error code with success:false and error message
     as provided in the arguments to the response argument provided.
     The caller of this function should return after calling.
    */
    _utils.sendErrorResponse = function(res, msg, errorCode) {
        var error, code;
        if (msg) {
            code = errorCode;
        } else {
            msg = "An unknown error has occurred.";
            code = 500;
        }

        res.status(code).json({
            success: false,
            message: msg,
        }).end();
    };

    /**
     Send a 200 OK with success:true and content:content in the
     request body to the response argument provided.
     The caller of this function should return after calling.
     */
    _utils.sendSuccessResponse = function(res, content) {
        res.status(200).json({
            success: true,
            content: content
        }).end();
    };

    Object.freeze(_utils);
    return _utils;

})();

module.exports = utils;