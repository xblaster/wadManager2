'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ParamsEntrySchema = new Schema({
  name: String,
  content: Schema.Types.Mixed
});

ParamsEntrySchema.statics.findByName = function findByName(q) {
    return this.find({"name": q.name});
}

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
  return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');*/

mongoose.model('ParamsEntry', ParamsEntrySchema);