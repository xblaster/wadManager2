'use strict';

angular.module('v9App')
  .controller('BudgetEditCtrl', function ($scope, $http, $routeParams , $location, $window) {
   	 if (!$routeParams.month) {
    	$location.path("/");
  	 }	

  	 //init budgets object
  	 $scope.budgets ={};
  	 $scope.budgets.date = moment().year($routeParams.year).month($routeParams.month-1).day(1).format('YYYY/MM/DD');;
  	 $scope.budgets.content = [];

     $scope.getLatestBudget = function() {
        $http.get('/budget/get?year='+$routeParams.year+'&month='+($routeParams.month-1)).success(function(entry) {
        console.log(entry);
        if (!_.isEmpty(entry)) {
            $scope.budgets = entry;
          }
       });
     }

  	 $http.get('/budget/get?year='+$routeParams.year+'&month='+$routeParams.month).success(function(entry) {
  	 	console.log(entry);
  	 	if (!_.isEmpty(entry)) {
	      	$scope.budgets = entry;
      	}
     });

     $scope.save = function(budgets) {	
     	$scope.saveInProgress = true;
		$http.post('/budget/save', budgets).success(function() {
      		$scope.saveInProgress = false;
      		$window.history.back();
    	});    	
     }

	$scope.addBudgetLine = function() {
    	$scope.budgets.content.push({});
    }

    $scope.removeLine = function(index) {
    	 $scope.budgets.content.splice(index, 1);
    }
  });
