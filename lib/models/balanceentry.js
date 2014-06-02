'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var BalanceEntrySchema = new Schema({
  description: String,
  date: { type: Date, index: true },
  tags: { type: [String], index: true },
  realDate: { type: Date, index: true },
  amount: Number
});

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');*/

mongoose.model('BalanceEntry', BalanceEntrySchema);