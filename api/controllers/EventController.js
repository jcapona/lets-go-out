/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/*
API v2.0
Consumer Key  cejkkcLoqNYxpO11QDzYog
Consumer Secret -QMfIUEAFz59sVuMxjzpWinXKAo
Token GyGczgYAy_KePiuSXUnZdurr-bmKcLw8
Token Secret  D6vnpL8R4z5rNslVmLvXf7aPcSU
*/

var yelp = require("node-yelp");
var yelpKeys = {
  consumer_key: 'cejkkcLoqNYxpO11QDzYog', 
	consumer_secret: '-QMfIUEAFz59sVuMxjzpWinXKAo',
	token: 'GyGczgYAy_KePiuSXUnZdurr-bmKcLw8',
	token_secret: 'D6vnpL8R4z5rNslVmLvXf7aPcSU'
};

module.exports = {
	'search' : function(req, res) {
    
    var term = req.query.term !== undefined ? req.query.term : "";
    var location = req.query.location !== undefined ? req.query.location: "";
    
		var client = yelp.createClient({
		  oauth: {
		    "consumer_key": yelpKeys.consumer_key,
		    "consumer_secret": yelpKeys.consumer_secret,
		    "token": yelpKeys.token,
		    "token_secret": yelpKeys.token_secret
		  },

		  httpClient: {
		    maxSockets: 25  // ~> Default is 10 
		  }
		});
		 
		client.search({
		  terms: term,
		  location: location
		}).then(function (data) {
		  var businesses = data.businesses;
		  var location = data.region;
		  
		  return res.send({
        message: data
      });
		});

  },
};