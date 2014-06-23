'use strict';

angular.module('v9App')
  .controller('OverviewCtrl', function ($scope, $http, BalanceService, BudgetService) {
      var momentCursor = moment();
      $scope.balances = {};
      $scope.budgets = {};

      $scope.computedBudgets = {}

      var past = moment().subtract('months', 4);

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
         }  );

         $scope.allTags= _.uniq($scope.allTags);
        //console.log($scope.allTags);
      }


      for (var i = 0; i < 9; i++) {
          $scope.retrieveVarsFor(momentCursor);
          momentCursor = momentCursor.add('month',1);
      }







  });
