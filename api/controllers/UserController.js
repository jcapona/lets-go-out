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
	},
	register: function(req, res) {
	  User.create(req.params.all()).exec(function (err, user) {
	    if (err)
      {
        req.session.flash = {
          error: "Error registering: Username/Email already taken/used"
        } 
	    	return res.redirect("/index");
      }

	    req.login(user, function (err){
	      if (err) 
        {
          req.session.flash = {
           error: "Error logging in. Please try again."
          } 
        }
	      return res.redirect('/index');
	    });
	  });
	}

};