'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, BalanceService, $routeParams, $location) {

    $scope.currYear = moment().get('year');
    $scope.currMonth = moment().get('month');

    if (!$routeParams.year) {
      $location.path( "/view/"+$scope.currMonth+"/"+$scope.currYear );
    } else {
        $scope.currYear = $routeParams.year;
        $scope.currMonth = $routeParams.month;
    }


    $scope.months = _.range(1,13);
    $scope.years = _.range(parseInt($scope.currYear,10)-3,parseInt($scope.currYear,10)+3);


  	$scope.refresh = function() {
  		//$http.get('/rest/balanceentry?sort=date').success(function(data) {
      BalanceService.get($scope.currYear,$scope.currMonth).success(function(data) {
      		$scope.balances = data;
          $scope.refreshBudget(data.payload);
    	});	
  	}

    $scope.refreshBudget = function (balances) {
        var budgets = {};

        _.each(balances, function(elt) {

          //console.log(elt);
            _.each(elt.tags, function(tag) {
              //console.log(tag);
              budgets[tag] = budgets[tag]|| 0;

              budgets[tag] = budgets[tag] + elt.amount;              

            });
        })

        $scope.budgets = budgets;
    }

    

    $scope.remove = function(id) {
		$http.delete('/rest/balanceentry/'+id).success(function(data) {
      		$scope.refresh();
    	});    	
    }

    $scope.refresh();
 
  });
