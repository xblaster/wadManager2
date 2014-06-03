'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var moment = require('moment');
    
/**
 * Thing Schema
 */
var BudgetSchema = new Schema({
  date: Date,
  content: Schema.Types.Mixed
});

BudgetSchema.statics.findByName = function findByDate(q) {
    return this.find({"date": {"$gte": new Date(q.year, q.month-1, 1), "$lt": new Date(q.year, q.month-1, 31)}});
}

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');*/

mongoose.model('Budget', BudgetSchema);