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

function handleLine(line ,tags) {
	var fields = line.split("\t");
	var balanceEntry = {};

  //transform tags
  if (tags.trim().length==0) {
    balanceEntry.tagsOrig = [];
  }else {
    balanceEntry.tagsOrig = _.map(tags.split(","), function(e) {return e.trim()}) ;
  }
	
	if (fields.length < 3) {
		return;
	}

	balanceEntry.date = moment(fields[0], "DD/MM/YY").format('YYYY/MM/DD');
    balanceEntry.realDate = balanceEntry.date;
	balanceEntry.description = fields[1].trim();
	balanceEntry.amount = fields[2].replace(",",".");

    balanceEntry.description = simplifyDescription(balanceEntry.description);
    balanceEntry.importDate = new Date();


	var balance = new BalanceEntry(balanceEntry);


  
  BalanceEntry.find({'description' : balanceEntry.description, 'amount': balanceEntry.amount}, function (err, docs) {

    var eltToHandle;

    if (docs.length != 0) {
        eltToHandle = docs[0];
    } else {
      eltToHandle = balance;
      //eltToHandle = detectTags(eltToHandle);
    }

    eltToHandle.save();

  });
}

function simplifyDescription(description) {
    var simplifications=  {
        "FACTURE CARTE ": 'CB ',
        "RETRAIT DAB ": "DAB ",
        "EUROPEEN SEPA ": "",
        "EMIS /PID ": "",
        "EMIS  /PID": ""
    }

    _.each(simplifications, function(value, key, list) {
         description = description.replace(key, value);
    });

    return description;
}

//deprecated
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
    /*console.log(value);
    console.log(key);
    console.log('--------------');*/
    if (eltToHandle.description.toLowerCase().indexOf(key) != -1) {
      eltToHandle.tags.push(value);
    }
  });
  eltToHandle.tags = _.uniq(eltToHandle.tags);
  return eltToHandle;
}

function handleData (datas,tags) {
	//console.log(datas);
	var lines = datas.split("\n");
	//console.log(lines.length);

	for (var i = 1 ; i < lines.length; i++ ) {
		handleLine(lines[i], tags);
	}	
}

exports.upload = function(req, res) {
    //var fstream;
    req.pipe(req.busboy);

    var tags = "";

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        var datas = "";

        req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
          //console.log('Field [' + fieldname + ']: value: ' + val);
          if (fieldname == "tags") {
            tags = val;
          }
        });

        file.on('data', function(data) {
              datas = datas + data;
              //console.log('receive data '+data.length);
            });

        file.on('end', function() {

        });

       req.busboy.on('finish', function() {
            handleData(datas,tags);
            res.redirect('/');
        });
    });

    

      
    
}