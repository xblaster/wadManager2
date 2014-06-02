'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var BudgetSchema = new Schema({
  description: String,
  date: Date,
  value: Number
});

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');*/

mongoose.model('Budget', BudgetSchema);