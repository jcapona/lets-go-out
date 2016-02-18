/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	'*': function(req, res) {
	    return res.send({
	        message: "Event"
	    });
    },
};

