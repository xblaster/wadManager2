'use strict';

angular.module('v9App')
  .controller('SettingsCtrl', function ($scope, $http, $location) {
    $http.get('/params/get?name=tags').success(function(result) {
      $scope.tags = result;
    });




    $scope.addTag = function() {
    	$scope.tags.push({'inBudget':true,"color":"#CCC"});
    }

    $scope.removeTag = function(index) {
    	 $scope.tags.splice(index, 1);
    }

    $scope.save = function() {
		$http.post('/params/save', {'name': 'tags', content: $scope.tags}).success(function(result) {
      		$location.path("/");
    	});    	
    }


  });