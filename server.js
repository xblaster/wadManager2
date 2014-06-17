'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');
var mers = require('mers');
var busboy = require('connect-busboy');
/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

  
    

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});


// Passport Configuration
var passport = require('./lib/config/passport');

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Setup Express
var app = express();

app.use('/rest', mers({uri: config.mongo.uri}).rest());
app.use(busboy());

/*app.use(function(req, res, next) {
    var auth = require('basic-auth');
    var user = auth(req);

    if (user === undefined || user['name'] !== 'wadmanager' || user['pass'] !== 'wadmanager2014') {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="MyRealmName"');
        res.end('Unauthorized');
    } else {
        next();
    }
});*/


require('./lib/config/express')(app);
require('./lib/routes')(app);






// Start server
app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
