'use strict';

var mongoose = require('mongoose'),
    BalanceEntry = mongoose.model('BalanceEntry');


var moment = require('moment');

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
	balance.save();

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