'use strict';

var mongoose = require('mongoose'),
    BalanceEntry = mongoose.model('BalanceEntry');

exports.save = function(req, res) {
	console.log(req.body);
  var obj = req.body;
  var balance = new BalanceEntry(obj);
  balance.save(function(err) {
  	if (err) {
  		return res.send(500,err);
  		console.log(err);
  	} else {
		return res.send(err);
  	}
  	
  });
};
 
exports.all = function(req, res) {
  return BalanceEntry.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};