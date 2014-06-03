'use strict';

var mongoose = require('mongoose'),
    ParamsEntry = mongoose.model('ParamsEntry');

var _ = require('underscore');


exports.get = function(req, res) {
	ParamsEntry.find({"name": req.param('name')}, function(err,result) {
		if (result.length > 0) {
			return res.send(result[0].content);
		}
		return res.send(result);
	});
}

exports.save = function(req, res) {
  var obj = req.body;

  //this is crap but quick :-\
  ParamsEntry.find({"name": obj.name}, function(err,result) {
  		console.log("result");
  		console.log(result);
		if (result.length > 0) {
			obj._id = result[0]._id;
			console.log("obj "+obj._id);
		}



		  if (obj._id) {
		    //of have an id
		    ParamsEntry.findByIdAndUpdate(obj._id, { $set: obj}, function (err, params) {
		      if (err) {
		        console.log(err);
		        return res.send(500,err);  
		      }
		      return res.send(params);  
		    });
		  } else {
		    //create obj
		    var params = new ParamsEntry(obj);
		    params.save(function(err) {
		    if (err) {
		      return res.send(500,err);
		      console.log(err);
		    } else {
		      return res.send("cool ;p");
		    }
		    
		  });  
		  }

  });


};