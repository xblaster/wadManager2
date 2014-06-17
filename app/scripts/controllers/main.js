'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, BalanceService, $routeParams, $location) {

    //fetch persons
    $http.get('/rest/persons/').success(function(entry) {
       $scope.payload = data
    });
  });

