'use strict';

angular.module('v9App')
  .controller('MainCtrl', function ($scope, $http, BalanceService, $routeParams, $location, BudgetService) {

    $scope.currYear = moment().get('year');
    $scope.currMonth = moment().get('month')+1;

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
      $scope.isLoading = true;
      BalanceService.get($scope.currYear,$scope.currMonth).success(function(data) {
            $scope.isLoading = false;
      		$scope.balances = data;
            $scope.refreshBudget();
    	});	
  	}

    $scope.refreshBudget = function () {
        $scope.budgetsComputed = BudgetService.getBudgetFor($scope.balances.payload, $scope.budgets);
    }

    

    $scope.remove = function(id) {
        if (confirm()) {
            $http.delete('/rest/balanceentry/'+id).success(function(data) {
                $scope.refresh();
            });
        }
    }

    $scope.getPercentFor = function (budget) {
       var prev = Math.abs(budget.prevision);
       var consumed = Math.abs(budget.consumed);

       var res = consumed*100/prev;

       if (res > 100) {
        //return 100;
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

    $scope.isTagPresent = function(entry, tag) {
        return _.contains(entry.tags, tag);
    }

    $scope.toggleTag = function(entry, tag) {
        if (_.contains(entry.tags, tag)) {
            entry.tags = _.without(entry.tags, tag);
        } else {
            entry.tags.push(tag);
        }

        $scope.save(entry);
    }

    $scope.isEntryValid = function(entry) {
        return (entry.tags.length >= 1)
    }

    $scope.save = function(elt) {
        $http.post('/entry/save', elt).success(function() {
            $scope.refreshBudget();
        });


    }

    $scope.refresh();
 
  });

