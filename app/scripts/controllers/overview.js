'use strict';

angular.module('v9App')
  .controller('OverviewCtrl', function ($scope, $http, BalanceService, BudgetService, $filter) {
      var momentCursor = moment();
      var numberFilter = $filter('number');
      $scope.balances = {};
      $scope.budgets = {};

      $scope.computedBudgets = {};

      $scope.monthInProgress = moment().format('YYYY/MM');

     var past = momentCursor = moment().subtract('months', 4);

      $scope.setSelectedMonth = function(selectedMonth) {
        $scope.monthInProgress = selectedMonth;
        $scope.refreshOverall();
      }

      $scope.getSelectedMonth = function() {return $scope.monthInProgress;}

      $scope.retrieveVarsFor = function(momentObj) {
            var indexedString = momentObj.format('YYYY/MM');


            $http.get('/budget/get?year='+momentObj.year()+'&month='+(momentObj.month()+1)).success(function(entry) {
                if (!_.isEmpty(entry)) {
                    $scope.budgets[indexedString] = entry;
                    $scope.refreshBudgetFor(indexedString);
                }
            });

            BalanceService.get(momentObj.year(),momentObj.month()+1).success(function(data) {
                $scope.balances[indexedString] = data.payload;
                $scope.refreshBudgetFor(indexedString);
            });
      }

      $scope.refreshBudgetFor = function(indexedString) {
           var budgets = $scope.budgets[indexedString] || {}
           var balances = $scope.balances[indexedString] || {}
           //console.log("refresh "+indexedString);
           //console.log(balances);

           $scope.computedBudgets[indexedString] = BudgetService.getBudgetFor(balances, budgets);
           $scope.refreshOverall();

           //console.log($scope.balances);
      }

      $scope.refreshOverall = function() {

        $scope.allTags = [];

         _.each($scope.computedBudgets, function(value, key, list) {
            _.each(value.tags, function(value2, key2, list2) {
              $scope.allTags.push(key2);
            });

            $scope.refreshPrevisionForBudget(key,value);


         }  );

         $scope.allTags= _.uniq($scope.allTags);
        //console.log($scope.allTags);
      }

      $scope.refreshPrevisionForBudget = function( key, budget) {
        console.log(key)
        _.each(budget.tags, function(value, key2, list) {
            //console.log(key > $scope.getSelectedMonth());
            //console.log(key+" > "+$scope.getSelectedMonth());
            value.displayNote = undefined;
            if (key > $scope.getSelectedMonth()) {
              value.displayVal = value.prevision;
            } else if ( key == $scope.getSelectedMonth()) {
              value.displayVal = -12;
              value.displayNote = numberFilter(value.consumed,2)+" ("+numberFilter(value.prevision,2)+")";
            } else {
              value.displayVal = value.consumed;            
            }
        });

        return budget;
      }


      for (var i = 0; i < 9; i++) {
          $scope.retrieveVarsFor(momentCursor);
          momentCursor = momentCursor.add('month',1);
      }







  });
