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
    $scope.tagsInfo = {}; //info in tags
    $scope.budgets = {content:[]};
    $scope.balances = {};
    $scope.balances.payload = [];

    $http.get('/params/get?name=tags').success(function(result) {
      _.each(result, function(elt) {
        $scope.tagsInfo[elt.name] = elt;
      });     
    });

    
    

    //fetch budgets
    $http.get('/budget/get?year='+$routeParams.year+'&month='+$routeParams.month).success(function(entry) {
      if (!_.isEmpty(entry)) {
          $scope.budgets = entry;
          $scope.refreshBudget();
      } 
    });

    $scope.geInfoFor = function(tagName) {
      return $scope.tagsInfo[tagName];
    }

    $scope.getColorForTag = function (tagName) {
      var tag = $scope.tagsInfo[tagName];
      if (tag) {
        return tag.color;
      }
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
        budgets.tags = {};
        budgets.income = 0;
        budgets.outcome = 0;

        //calculate consumed
        _.each($scope.balances.payload, function(elt) {
            _.each(elt.tags, function(tag) {
              budgets.tags[tag] = budgets.tags[tag] || {prevision: 0, consumed:0};              
              budgets.tags[tag].consumed = budgets.tags[tag].consumed + elt.amount;              
            });
        })

        _.each(budgets.tags, function(value, key, list) {
            var tagInfo = $scope.geInfoFor(key);
            if (value.prevision) {
              if (value.consumed > 0 ) {
                 budgets.income+= value.consumed;
              } else {
                 budgets.outcome+= value.consumed;
              }
            }
        });

        budgets.balance = budgets.income + budgets.outcome;

         _.each($scope.budgets.content, function(elt) {
            var tag = elt.name;
            budgets.tags[tag] = budgets.tags[tag]|| {prevision: 0, consumed:0};            
            budgets.tags[tag].prevision = Math.abs(elt.value);
            budgets.tags[tag].credit = elt.credit;
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
