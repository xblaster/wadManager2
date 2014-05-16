'use strict';

var mongoose = require('mongoose'),
    Thing = mongoose.model('Thing');

var request = require('request')
  , cheerio = require('cheerio');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};



exports.getAllMatchs = function(req, res) {

	var url = 'http://en.wikipedia.org/wiki/2014_FIFA_World_Cup';

	request(url, function(err, resp, body){
	  var $ = cheerio.load(body,  {normalizeWhitespace: true});

	  var matches = [];

	  $('.vevent').each(function(i, elem) {

	  	var match = {};
	  	match.attendee = [];

	  	match.date = $(elem).find(".summary").text();

	  	$(elem).find('.attendee').each(function(i, elem) {
	  		match.attendee.push($(elem).text());
	  	});
	  	matches.push(match);
	  });
	  
	  res.send(matches);

	});


}