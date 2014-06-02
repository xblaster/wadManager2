'use strict';

angular.module('v9App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/entry/add', {
        templateUrl: 'partials/entry/add',
        controller: 'EntryAddCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    /*$locationProvider.html5Mode(true);*/
  });