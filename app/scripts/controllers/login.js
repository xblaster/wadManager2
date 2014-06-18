'use strict';

angular.module('v9App')
  .controller('LoginCtrl', function ($scope, $http, $location) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.login = function() {
        $location.path('/');
    }
  });
