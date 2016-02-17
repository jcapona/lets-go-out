/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  'new': function (req, res) {
    res.view();
  },
  index: function (req, res) {
    User.find(function foundUser (err, users) {
      if(err) return res.redirect('/user/new');
      res.view({
        users: users
      });
    });
  },
  create: function(req, res) {
      User.create(req.params.all(), function userCreated(err, user) {
        if (err) return res.redirect('/user/new');
        res.redirect('/user/show/' + user.id); 
      });
  },
  'show': function (req, res) {

  }
};

