'use strict';

var mongoose = require('mongoose'),
    BalanceEntry = mongoose.model('BalanceEntry');

var _ = require('underscore');

var moment = require('moment');
var Levenshtein = require('levenshtein');


function jsonToExcel(entries) {
  var res = "";

  var mapped = _.map(entries, function(entry) {
    return moment(entry.realDate).format("DD/MM/YYYY")+", "+ entry.amount+", "+entry.description+", " +entry.tagsOrig[0]+", " +entry.tags[0];
  });

  return _.reduce(mapped, function(memo, num){ return memo +"\n" +num; }, "date, montant, description, compte origine, catégorie");
}

exports.excel = function(req, res) {
    return BalanceEntry.find(function (err, entries) {
      if (!err) {
        res.setHeader('Content-disposition', 'attachment; filename=export.csv');
        return res.send(jsonToExcel(entries));
        //return res.json(things);
      } else {
        return res.send(err);
      }
    });
}

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


var handleLine = function(line, tags) {
  console.log("line "+line);
  line.importDate = new Date();

  var balance = new BalanceEntry(line);

  insertBalance(balance,tags);  
}

var convertLineBNP = function (line) {
  console.log("[CONVERT LINE BNP] "+line);
	var fields = line.split("\t");
	var balanceEntry = {};
	
	if (fields.length < 3) {

    return null; //eNd OF LINE
	}

	balanceEntry.date = moment(fields[0], "DD/MM/YY").format('YYYY/MM/DD');
  balanceEntry.realDate = balanceEntry.date;
	balanceEntry.description = fields[1].trim();
	balanceEntry.amount = fields[2].replace(",",".");

  return balanceEntry;
}

var convertLineCIC = function (line) {
  console.log("[CONVERT LINE CIC] "+line);
  var fields = line.split(",");
  var balanceEntry = {};
  
  if (fields.length < 3) {

    return null; //eNd OF LINE
  }

  balanceEntry.date = moment(fields[0], "MM/DD/YYYY").format('YYYY/MM/DD');
  balanceEntry.realDate = balanceEntry.date;
  balanceEntry.description = fields[4].trim();
  balanceEntry.amount = fields[2] || fields[3];

  return balanceEntry;
}


function findAnalogousEntry (balanceEntry, cbOK) {
  var momentSearchCursor = moment(balanceEntry.date).hour(0).minute(1);
  BalanceEntry.find({'amount': balanceEntry.amount,
      realDate: {"$gte": momentSearchCursor.format('YYYY/MM/DD'), "$lte": momentSearchCursor.add('day',1).format('YYYY/MM/DD')}}, function (err, docs) {

    if (err) {
        console.log("error saving balance "+err);
        return;
    }

    var eltToHandle;


  if (err) { console.log(err); return cbOK(null); }

    for (var i = 0; i < docs.length; i++) {
        var doc = docs[i];
        
        doc.description = simplifyDescription(doc.description);



        var l = new Levenshtein(doc.description.substr(0,30),balanceEntry.description.substr(0,30));
        if (l.distance !=0) {
          console.log("distance "+l.distance);
          console.log(doc.description);
          console.log(balanceEntry.description);
          console.log("-------");  
        }
        
        if (l.distance <= 6) {
          return cbOK(doc);
        }

        /*if (doc.description == balanceEntry.description) {
          console.log("analogous !");
          return cbOK(doc);
        }*/
    }

    return cbOK(null)

  });
}

function insertBalance(balanceEntry, tags) {
  //transform tags
  if (tags.trim().length==0) {
    balanceEntry.tagsOrig = [];
  }else {
    balanceEntry.tagsOrig = _.map(tags.split(","), function(e) {return e.trim()}) ;
  }
 
  
  
  balanceEntry.description = simplifyDescription(balanceEntry.description);


 findAnalogousEntry(balanceEntry, function (res) {
    if (res ==null) {
      balanceEntry.save();  
    }
  });
}

function simplifyDescription(description) {
    var simplifications=  {
        "FACTURE CARTE ": 'CB ',
        "RETRAIT DAB ": "DAB ",
        "EUROPEEN SEPA ": "",
        "SEPA ": "",
        "/PID ": "",
        "/EID": "",
        "/SDT": "",
        " EMIS ": ""
    }

    _.each(simplifications, function(value, key, list) {
         description = description.replace(key, value);
    });

    //remove duplicate space
    return description.replace(/\s\s+/g, ' ');

    //return result;
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

function handleData (datas,tags,mode) {
	//console.log(datas);
	var lines = datas.split("\n");
	console.log("document contain "+lines.length+" lines");

	for (var i = 1 ; i < lines.length; i++ ) {
    
    console.log("handle data");
    console.log("mode == "+mode);

    if (mode == "BNP") {
      var convLine = convertLineBNP(lines[i]);  
      if (convLine !== null) {
         handleLine(convLine, tags);
      }
     
    } else if (mode == "CIC") {
      var convLine = convertLineCIC(lines[i]);  
      if (convLine !== null) {
         handleLine(convLine, tags);
      }
     
    } else {
      console.log("no mode defined");
    }
    

	
	}	
}

exports.listTags = function(req, res) {
    BalanceEntry.distinct('tags',function(err, result) {
        /*{
            // Query is not required as of version 1.2.5
            "query": "Unit",
            "suggestions": [
            { "value": "United Arab Emirates", "data": "AE" },
            { "value": "United Kingdom",       "data": "UK" },
            { "value": "United States",        "data": "US" }
        ]
        } */


        result = _.without(result, null)   ;
        result = _.filter(result, function(elt){ return elt.indexOf(req.param('query')) !== -1 });


        var elts = _.map(result, function(elt) {
            return {"value": elt, "data" : elt}
        });

         res.send({"suggestions": elts});
    })  ;
}

exports.upload = function(req, res) {
    //var fstream;
    req.pipe(req.busboy);

    var tags = "";
    var mode = "";

    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 

        var datas = "";

        req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
          //console.log('Field [' + fieldname + ']: value: ' + val);
          if (fieldname == "tags") {
            tags = val;
            console.log("tags ="+tags);
          }

          if (fieldname == "mode") {
            console.log("mode = "+val);
            mode = val;
          }
        });

        file.on('data', function(data) {
              datas = datas + data;
              //console.log('receive data '+data.length);
            });

        file.on('end', function() {

        });

       req.busboy.on('finish', function() {
        //bug in busboy// finish is not so finished... 
            setTimeout(function() {
               handleData(datas,tags,mode);
                res.redirect('/');
            } ,1000)
           
        });
    });

    

      
    
}
