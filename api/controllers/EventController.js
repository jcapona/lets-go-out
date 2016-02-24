/**
 * EventController
 *
 * @description :: Server-side logic for managing social events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var yelp = require("node-yelp");
var yelpKeys = {
  consumer_key: 'cejkkcLoqNYxpO11QDzYog', 
	consumer_secret: '-QMfIUEAFz59sVuMxjzpWinXKAo',
	token: 'GyGczgYAy_KePiuSXUnZdurr-bmKcLw8',
	token_secret: 'D6vnpL8R4z5rNslVmLvXf7aPcSU'
};

module.exports = {
  
  'go' : function(req, res) {

    if(req.query.id === undefined)
      return res.send("Error");

    var dt = new Date();
    var date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

    Event.findOrCreate({id: req.query.id, date: date.toString()}).exec(function(error, event) {
    
      if(error) {
        console.error(error);
        return res.send('');
      }

      if(event.going === undefined)
        event.going = 1;
      else
        event.going += 1;

      event.save(function(error) {
        if(error) {
          console.error(error);
          return res.send('');
        } 
        else 
        {
          return res.send({going: event.going});
        }
      });
    
    });

  },
  'ungo' : function(req, res) {

    if(req.query.id === undefined)
      return res.send("Error");

    var dt = new Date();
    var date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

    Event.findOrCreate({id: req.query.id, date: date.toString()}).exec(function(error, event) {
    
      if(error) {
        console.error(error);
        return res.send('');
      }

      if(event.going === undefined)
        event.going = 0;
      else
        event.going -= 1;

      event.save(function(error) {
        if(error) {
          console.error(error);
          return res.send('');
        } 
        else 
        {
          return res.send({going: event.going});
        }
      });
    
    });

  },
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
		    maxSockets: 25
		  }
		});
		 
		client.search({
		  terms: term,
		  location: location
		}).then(function (data) {
		  var businesses = data.businesses;
		  var location = data.region;
      var j=1;

      businesses.forEach(function(val, index){
        var dt = new Date();
        var date = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();

        Event.findOrCreate({date: date, id: val.id}).exec(function(error, event){

          val.going = event.going;

          if((j === businesses.length))
          {
            return res.send({
              message: data
            });
          }
          else
            j++;
        });
      });
		})
    .catch(function (err) {
      console.log(JSON.stringify(err,null,2));
      res.status(400);
      return res.send({message: err});
    });
  },
};