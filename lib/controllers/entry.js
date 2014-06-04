'use strict';

var mongoose = require('mongoose'),
    BalanceEntry = mongoose.model('BalanceEntry');

var _ = require('underscore');

var moment = require('moment');

exports.save = function(req, res) {
	console.log(req.body);
  var obj = req.body;

  if (obj._id) {
    //of have an id
    BalanceEntry.findByIdAndUpdate(obj._id, { $set: obj}, function (err, balance) {
      if (err) {
        console.log(err);
        return res.send(500,err);  
      }
      return res.send(balance);  
    });
  } else {
    //create obj
    var balance = new BalanceEntry(obj);
    balance.save(function(err) {
    if (err) {
      return res.send(500,err);
      console.log(err);
    } else {
      return res.send("cool ;p");
    }
    
  });  
  }

  
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

function handleLine(line) {
	//console.log(line);
	var fields = line.split("\t");
	var balanceEntry = {};
	console.log(fields);

	if (fields.length < 3) {
		return;
	}

	//console.log(fields[1]);
	//console.log(moment(fields[1], "DD/MM/YY").format('YYYY/MM/DD'));
	balanceEntry.date = moment(fields[0], "DD/MM/YY").format('YYYY/MM/DD');
	balanceEntry.description = fields[1].trim();
	balanceEntry.amount = fields[2].replace(",",".");

	console.log(balanceEntry);
	console.log("---------------------");

	var balance = new BalanceEntry(balanceEntry);


  
  BalanceEntry.find({'description' : balanceEntry.description, 'amount': balanceEntry.amount}, function (err, docs) {

    var eltToHandle;

    if (docs.length != 0) {
        eltToHandle = docs[0];
    } else {
      eltToHandle = balance;
    }

    eltToHandle = detectTags(eltToHandle);
    eltToHandle.save();

  });
}

function detectTags(eltToHandle) {

  var detector = { 'ess': 'essence',
                   'dab': 'dab',
                   'leclerc': 'course',
                   'cora': 'cora',
                   'norma':'course',
                   'carrefour':'course',
                   'phcie': 'pharmacie',
                   'eat sushi': 'miam',
                   'brioche doree': 'miam',
                   'lunchtime': 'miam',
                   'intermarch':'course',
                   'sodexo':'miam',
                   'mcdonalds': 'miam',
                   'cgi luxembourg':'salaire'
                    }

  eltToHandle.tags =  eltToHandle.tags || [];

  _.each(detector, function(value, key, list) {
    console.log(value);
    console.log(key);
    console.log('--------------');
    if (eltToHandle.description.toLowerCase().indexOf(key) != -1) {
      eltToHandle.tags.push(value);
    }
  });    
  eltToHandle.tags = _.uniq(eltToHandle.tags);
  return eltToHandle;
}

function handleData (datas) {
	//console.log(datas);
	var lines = datas.split("\n");
	console.log(lines.length);

	for (var i = 1 ; i < lines.length; i++ ) {
		handleLine(lines[i]);
	}	
}

exports.upload = function(req, res) {
    //var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        var datas = "";

		file.on('data', function(data) {
        	datas = datas + data;
        	console.log('receive data '+data.length);
      	});

      	file.on('end', function() {
      		handleData(datas);
      		res.redirect('/');
      	});

        /*fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream)
        fstream.on('close', function () {
            res.redirect('back');
        });*/

    	//console.log(file);

    });
}