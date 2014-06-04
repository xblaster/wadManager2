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
    
    //init vars
    $scope.tagsColor = [];
    $scope.budgets = {content:[]};
    $scope.balances = {};
    $scope.balances.payload = [];

    $http.get('/params/get?name=tags').success(function(result) {
      $scope.tagsColor = result;
    });

    
    

    //fetch budgets
    $http.get('/budget/get?year='+$routeParams.year+'&month='+$routeParams.month).success(function(entry) {
      if (!_.isEmpty(entry)) {
          $scope.budgets = entry;
          $scope.refreshBudget();
      } 

    });

    $scope.getColorForTag = function (tagName) {
      var key;
      //damn this is dirt :\
       for (key in $scope.tagsColor) {
          var elt = $scope.tagsColor[key];
          if (elt.name === tagName) {
            return elt.color;
          }
       };
       return '#CCC';
    }

    $scope.months = _.range(1,13);
    $scope.years = _.range(parseInt($scope.currYear,10)-3,parseInt($scope.currYear,10)+3);


  	$scope.refresh = function() {
      BalanceService.get($scope.currYear,$scope.currMonth).success(function(data) {
      		$scope.balances = data;
          $scope.refreshBudget();
    	});	
  	}

    $scope.refreshBudget = function () {
        var budgets = {};

        //calculate consumed
        _.each($scope.balances.payload, function(elt) {

          //console.log(elt);
            _.each(elt.tags, function(tag) {
              //console.log(tag);
              budgets[tag] = budgets[tag]|| {prevision: 0, consumed:0};
              budgets[tag].description = elt.description;
              budgets[tag].consumed = budgets[tag].consumed + elt.amount;              

            });
        })

         _.each($scope.budgets.content, function(elt) {
            var tag = elt.name;
          //console.log(elt);
            budgets[tag] = budgets[tag]|| {prevision: 0, consumed:0};            
            budgets[tag].prevision = elt.value;
        })

        $scope.budgetsComputed = budgets;
    }

    

    $scope.remove = function(id) {
		$http.delete('/rest/balanceentry/'+id).success(function(data) {
      		$scope.refresh();
    	});    	
    }

    $scope.getPercentFor = function (budget) {
       var prev = Math.abs(budget.prevision);
       var consumed = Math.abs(budget.consumed);

       var res = consumed*100/prev;

       if (res > 100) {
        return 100;
       }
       return res;
    }

    $scope.getClassFor = function(budget) {
      var percent = $scope.getPercentFor(budget);

     

      if (percent > 85) {
         return {'progress-bar-danger' : 1};
      } 
       if (percent > 70) {
         return {'progress-bar-warning' : 1};
      } 
    }

    $scope.refresh();
 
  });
