'use strict';

angular.module('v9App')
  .controller('OverviewCtrl', function ($scope, $http, BalanceService, BudgetService) {
      var momentCursor = moment();
      $scope.balances = {};
      $scope.budgets = {};

      $scope.computedBudgets = {}

      var past = moment().subtract('months', 3);

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
            });
      }

      $scope.refreshBudgetFor = function(indexedString) {
           var budgets = $scope.budgets[indexedString] || {}
           var balances = $scope.balances[indexedString] || {}

           $scope.computedBudgets[indexedString] = BudgetService.getBudgetFor(balances, budgets);
      }


      for (var i = 0; i < 7; i++) {
          $scope.retrieveVarsFor(momentCursor);
          momentCursor = momentCursor.add('month',1);
      }







  });
