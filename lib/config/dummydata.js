'use strict';

var mongoose = require('mongoose'),
  Person = mongoose.model('Person');

var moment = require('moment');

var chance = require('chance')();
chance.ngBirthday = function() {
    var birthday = chance.birthday({type: chance.pick(['adult'])});
    var year = moment(birthday).year();
    if (year < 1925) {
        return moment(birthday).year(year+50).toDate();
    }

    return birthday;
}

/**
 * Populate database with sample application data
 */

var createPerson = function() {
    var person = {};

    var gender = chance.gender();

    person.firstName = chance.first({gender: gender});
    person.lastName = chance.last();
    person.birthday = chance.ngBirthday();



    //create product
    person.content = {};
    person.content.address = chance.address();
    person.content.city = chance.city();
    person.content.cli_number = chance.pad(chance.cc(),16);

    person.content.products = [];
    for (var i = 0; i < chance.integer({min: 1, max: 8}); i++) {
        var product = {};
        product.name = chance.pick(['COMPTECOURANT','DEPOTAVUE','CCGREENKIDS']);
        product.solde =  chance.integer({min: -200, max: 8000});
        product.number = "LU"+chance.pad(chance.cc(),16);


        person.content.products.push(product);
    }


    person.content.titulaires = [];

    var titulaireOwn = {};
    titulaireOwn.firstName = person.firstName;
    titulaireOwn.lastName = person.lastName;
    titulaireOwn.birthday = person.birthday;
    titulaireOwn.rating = chance.integer({min: 1, max: 5});

    person.content.titulaires.push(titulaireOwn);

    for (var i = 0; i < chance.integer({min: 0, max: 2}); i++) {
        var titulaire   = {};
        titulaire.firstName = chance.first();
        titulaire.lastName = chance.last();
        titulaire.birthday = chance.ngBirthday();
        person.content.titulaires.push(titulaire);
    }

    person.content.visites = [];
    for (var i = 1; i < chance.integer({min: 3, max: 13}); i++) {
        var visit   = {};

        visit.date = moment().add('day', -chance.integer({min: 1, max: 300})).toDate();
        visit.content = chance.paragraph();

        person.content.visites.push(visit);
    }

    return person;



}

//Clear old things, then add things in
Person.find({}).remove(function() {
  for (var i = 0; i < 50; i++) {
     Person.create(createPerson(), function() {
         console.log('person added');
     });
  }
  /*Thing.create({}{
    name : 'HTML5 Boilerplate',
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
    awesomeness: 10
  }, {
    name : 'AngularJS',
    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
    awesomeness: 10
  }, {
    name : 'Karma',
    info : 'Spectacular Test Runner for JavaScript.',
    awesomeness: 10
  }, {
    name : 'Express',
    info : 'Flexible and minimalist web application framework for node.js.',
    awesomeness: 10
  }, {
    name : 'MongoDB + Mongoose',
    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
    awesomeness: 10
  }, function() {
      console.log('finished populating things');
    }
  );*/
});
