/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	user: function(req, res) {
		if(req.user !== undefined)
			return res.send({user: req.user});
		else
			return res.send({});
	}
	
};