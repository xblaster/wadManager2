'use strict';

angular.module('v9App')
  .service('BudgetService', function Budget() {

    var getBudgetFor = function(balances, budgetsRef) {

        var budgets = {};
        budgets.tags = {};
        budgets.income = 0;
        budgets.outcome = 0;

        budgets.incomePrevision = 0;
        budgets.outcomePrevision = 0;

        //calculate consumed
        _.each(balances, function(elt) {
            _.each(elt.tags, function(tag) {
                budgets.tags[tag] = budgets.tags[tag] || {prevision: 0, consumed:0};
                budgets.tags[tag].consumed = budgets.tags[tag].consumed + elt.amount;

            });
        })

        _.each(budgetsRef.content, function(elt) {
            var tag = elt.name;
            budgets.tags[tag] = budgets.tags[tag]|| {prevision: 0, consumed:0};
            budgets.tags[tag].prevision = Math.abs(elt.value);
            budgets.tags[tag].credit = elt.credit;
        });

        _.each(budgets.tags, function(value, key, list) {
            console.log(value);
            if (value.prevision) {
                if (value.credit ) {
                    budgets.incomePrevision+= value.prevision;
                    budgets.income+= value.consumed;

                } else {
                    budgets.outcomePrevision+= value.prevision;
                    budgets.outcome+= value.consumed;
                }
            }
        });

        budgets.balance = budgets.income + budgets.outcome;



        console.log(budgets);

        return budgets;

    }

    return {
        getBudgetFor : getBudgetFor
    }
  });
