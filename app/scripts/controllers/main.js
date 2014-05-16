'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, TeamService) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    TeamService.get().success(function(data) {
    	$scope.teams = data.sports[0].leagues[0].teams;
    });

  });
