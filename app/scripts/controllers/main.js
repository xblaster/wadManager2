'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, TeamService) {


  	$scope.refresh = function() {
  		$http.get('/rest/balanceentry').success(function(data) {
      		$scope.balances = data;
    	});	
  	}

    

    $scope.remove = function(id) {
		$http.delete('/rest/balanceentry/'+id).success(function(data) {
      		$scope.refresh();
    	});    	
    }

    $scope.refresh();
 
  });
