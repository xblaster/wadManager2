'use strict';

var mongoose = require('mongoose'),
    Budget = mongoose.model('Budget');

var _ = require('underscore');


exports.get = function(req, res) {

	var q = {};
	q.year = req.param("year");
	q.month = req.param("month");

	Budget.find({"date": {"$gte": new Date(q.year, q.month-1, 1), "$lt": new Date(q.year, q.month-1, 31)}}, function(err,result) {
		if (result.length > 0) {
			return res.send(result[0]);
		}
		return res.send(result);
	});
}

exports.save = function(req, res) {
	 var obj = req.body;

   console.log("log budget save");
   console.log(obj);

  if (obj._id) {
    //of have an id
    Budget.findByIdAndUpdate(obj._id, { $set: obj}, function (err, budget) {
      if (err) {
        console.log(err);
        return res.send(500,err);  
      }
      return res.send(budget);  
    });
  } else {
    //create obj
    var budget = new Budget(obj);
    budget.save(function(err) {
    if (err) {
      return res.send(500,err);
      console.log(err);
    } else {
      return res.send("cool ;p");
    }
    
  });  
  }
 }


