// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var userSchema = new mongoose.Schema({
    name: {type: String, required: true},                       // validation error
    email: {type: String, required: true, unique: true},        // validation error x2
    pendingTasks: {type:[String]},
    dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('User', userSchema);