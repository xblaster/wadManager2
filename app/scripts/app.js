'use strict';

angular.module('v9App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'colorpicker.module'
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
      .when('/budget/view/:month/:year', {
        templateUrl: 'partials/budget/view',
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
      .when('/budget/edit/:month/:year', {
        templateUrl: 'partials/budget/edit',
        controller: 'BudgetEditCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    /*$locationProvider.html5Mode(true);*/
  });