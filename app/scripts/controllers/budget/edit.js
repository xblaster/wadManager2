'use strict';

angular.module('v9App')
  .controller('BudgetEditCtrl', function ($scope, $http, $routeParams , $location, $window) {
   	 if (!$routeParams.month) {
    	$location.path("/");
  	 }	

  	 //init budgets object
  	 $scope.budgets ={};
  	 $scope.budgets.date = moment(new Date($routeParams.year,$routeParams.month-1,12)).format('YYYY/MM/DD');;
     console.log($scope.budgets.date);
  	 $scope.budgets.content = [];

     $scope.getLatestBudget = function() {
        $http.get('/budget/get?year='+$routeParams.year+'&month='+($routeParams.month-1)).success(function(entry) {
        console.log(entry);

        var id  = $scope.budgets._id;

        if (!_.isEmpty(entry)) {
            $scope.budgets = entry;
            $scope.budgets.date = moment(new Date($routeParams.year,$routeParams.month-1,12)).format('YYYY/MM/DD');;
            $scope.budgets._id = id;
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
