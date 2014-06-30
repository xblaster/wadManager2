'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var BalanceEntrySchema = new Schema({
  description: String,
  note: String,
  date: { type: Date, index: true },
  tags: { type: [String], index: true },
  otherTag : {type: Boolean},
  tagsOrig: { type: [String], index: true },
  importDate : Date,
  realDate: { type: Date, index: true },
  amount: Number
});

BalanceEntrySchema.statics.findForMonth = function findForMonth(q) {
	console.log(q);
    return this.find({"date": {"$gte": new Date(q.year, q.month-1 ,1), "$lt": new Date(q.year, q.month, 1)}});
    //return this.find();
}

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');*/

mongoose.model('BalanceEntry', BalanceEntrySchema);