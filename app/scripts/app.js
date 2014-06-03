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
      .when('/view/:month/:year', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/entry/edit/:entryId', {
        templateUrl: 'partials/entry/edit',
        controller: 'EntryEditCtrl'
      })
      .when('/entry/add', {
        templateUrl: 'partials/entry/edit',
        controller: 'EntryEditCtrl'
      })
      .when('/upload', {
        templateUrl: 'partials/upload',
        controller: 'UploadCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    /*$locationProvider.html5Mode(true);*/
  });