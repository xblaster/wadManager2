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

        budgets.incomePrediction = 0;
        budgets.outcomePrediction = 0;

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
            if (elt.credit) {
                budgets.tags[tag].prevision = Math.abs(elt.value);
            } else {
                budgets.tags[tag].prevision = -Math.abs(elt.value);
            }

            budgets.tags[tag].credit = elt.credit;
        });

        //consolidate data
        _.each(budgets.tags, function(value, key, list) {
            console.log(value);
            if (value.prevision) {
                if (value.credit ) {
                    budgets.incomePrevision+= value.prevision;
                    budgets.income+= value.consumed;


                    if (value.prevision > value.consumed) {
                        budgets.incomePrediction += (value.prevision - value.consumed);
                        value.prediction = value.prevision;
                    } else {
                        value.prediction = value.consumed;
                    }



                } else {
                    budgets.outcomePrevision+= value.prevision;
                    budgets.outcome+= value.consumed;
                    console.log(budgets);
                    if (value.prevision < value.consumed) {
                        budgets.outcomePrediction += (value.prevision - value.consumed);
                        value.prediction = value.prevision;
                    } else {
                        value.prediction = value.consumed;
                    }
                }
            } else {
                if (value.consumed > 0) {
                    budgets.income+= value.consumed;
                    value.credit = true;
                } else {
                    budgets.outcome+= value.consumed;
                }
            }
        });

        budgets.balance = budgets.income + budgets.outcome;
        budgets.balancePrevision = budgets.incomePrevision + budgets.outcomePrevision;



        //console.log(budgets);

        return budgets;

    }

    return {
        getBudgetFor : getBudgetFor
    }
  });
