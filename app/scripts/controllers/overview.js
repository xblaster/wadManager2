'use strict';

angular.module('v9App')
  .controller('OverviewCtrl', function ($scope, $http, BalanceService, BudgetService, $filter) {
      var momentCursor = moment();
      var numberFilter = $filter('number');
      $scope.balances = {};
      $scope.budgets = {};

      $scope.computedBudgets = {};
      $scope.initialValue = 0;

      $scope.monthInProgress = moment().format('YYYY/MM');


     var past = momentCursor = moment().subtract('months', 4);

     $http.get('/params/get?name=tags').success(function(result) {
            $scope.tagsInfoList = [];
            $scope.tagsInfo = {};
            _.each(result, function(elt) {
                $scope.tagsInfo[elt.name] = elt;
                $scope.tagsInfoList.push(elt.name);
            });

            $scope.refreshOverall();
     });

     $scope.toggleSpecialFor = function(budget) {
         budget.special = !budget.special;
         console.log(budget);
         $scope.refreshOverall();
     }


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


          var total = parseInt($scope.initialValue,10);

         _.each($scope.computedBudgets, function(value, key, list) {
            _.each(value.tags, function(value2, key2, list2) {
              $scope.allTags.push(key2);
            });

            total = $scope.refreshPrevisionForBudget(key,value, total).total;


         }  );

          //_.sortBy($scope.allTags, function(num){ return Math.sin(num); });
        $scope.allTags = _.uniq($scope.allTags);

        console.log($scope.tagsInfoList);

        $scope.normalTag = _.filter($scope.allTags, function(tag) {
            return _.contains($scope.tagsInfoList, tag);
        })

        $scope.extraTag = _.filter($scope.allTags, function(tag) {
              return !_.contains($scope.tagsInfoList, tag);
        })

        //console.log($scope.allTags);
      }

      $scope.refreshPrevisionForBudget = function( key, budget, total) {
        console.log(key)

        budget.displayIncome = 0;
        budget.displayOutcome = 0;
        budget.displayBalance = 0;

        _.each(budget.tags, function(value, key2, list) {
            //console.log(key > $scope.getSelectedMonth());
            //console.log(key+" > "+$scope.getSelectedMonth());
            value.displayNote = undefined;
            if (key > $scope.getSelectedMonth()) {
              value.displayVal = value.prevision;
            } else if ( key == $scope.getSelectedMonth()) {
              if (value.prediction) {
                  value.displayVal = value.prediction;
                  value.displayNote = numberFilter(value.consumed,2);

                  if (value.prevision > value.consumed ) {
                      value.displayNote += " ( reste "+numberFilter((value.prevision-value.consumed),2)+")";
                  }
              } else {
                  value.displayVal = value.consumed;
              }


            } else {
              value.displayVal = value.consumed;            
            }

            if (value.special) {
                return;
            }


             if (value.displayVal > 0) {
                 budget.displayIncome += value.displayVal;
             } else {
                 budget.displayOutcome += value.displayVal;
             }

             budget.displayBalance += value.displayVal;




        });

        budget.total = total + budget.displayBalance;

        return budget;
      }


      for (var i = 0; i < 9; i++) {
          $scope.retrieveVarsFor(momentCursor);
          momentCursor = momentCursor.add('month',1);
      }







  });
