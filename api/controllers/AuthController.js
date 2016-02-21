var passport = require('passport');

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },

  login: function(req, res) {

    passport.authenticate('local', function(err, user, info) {
      if ((err) || (!user)) {
        req.session.flash = {
          error: info.message
        }
        return res.redirect('/index');
        // return res.send({ message: info.message, user: user });
      }
      req.logIn(user, function(err) {
        if (err) 
          res.send(err);
         
        req.session.flash = {
          success: info.message
        } 
        return res.redirect('/index');
        //return res.send({ message: info.message, user: user });
      });

    })(req, res);
  },

  logout: function(req, res) {
    req.logout();
    req.session.flash = {
      success: "You've been logged out. Come back later!"
    } 
    res.redirect('/');
  }
};

