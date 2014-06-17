var mongoose = require('mongoose'),
    Person = mongoose.model('Person');

var _ = require('underscore');

var moment = require('moment');

exports.save = function(req, res) {
    console.log(req.body);
    var obj = req.body;

    if (obj._id) {
        //of have an id
        Person.findByIdAndUpdate(obj._id, { $set: obj}, function (err, balance) {
            if (err) {
                console.log(err);
                return res.send(500,err);
            }
            return res.send(balance);
        });
    } else {
        //create obj
        var person = new Person(obj);
        person.save(function(err) {
            if (err) {
                return res.send(500,err);
                console.log(err);
            } else {
                return res.send("cool ;p");
            }

        });
    }
};