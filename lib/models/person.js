/**
 * Created with IntelliJ IDEA.
 * User: jerome
 * Date: 6/17/14
 * Time: 1:41 PM
 * To change this template use File | Settings | File Templates.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var PersonSchema = new Schema({
    lastName: String,
    firstName: String,
    projects: [Schema.Types.Mixed],
    content: Schema.Types.Mixed
});

PersonSchema.statics.findByName = function findByName(q) {
    return this.find({"name": q.name});
}

/**
 * Validations
 */
/*ThingSchema.path('awesomeness').validate(function (num) {
 return num >= 1 && num <= 10;
 }, 'Awesomeness must be between 1 and 10');*/

mongoose.model('Person', PersonSchema);