'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    entry = require('./controllers/entry'),
    params = require('./controllers/params');


/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/awesomeThings')
    .get(api.awesomeThings);

  app.route('/api/matchs/all').get(api.getAllMatchs);
  
  app.route('/params/save').post(params.save);
  app.route('/params/get').get(params.get);

  app.route('/entry/save').post(entry.save);
  app.route('/entry/all').get(entry.all);
  app.route('/upload').post(entry.upload);


  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);

  app.route('/').get(index.index);

  //app.all('*', requireAuthentication, loadUser);

  /*app.route('/*')
    .get( index.index);*/
};


