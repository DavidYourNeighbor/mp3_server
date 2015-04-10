// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var taskSchema = new mongoose.Schema({
    name: {type: String, required: true},               //validation error
    description: {type: String, default: ''},
    deadline: {type: Date, required: true},             //validation error
    completed: {type: String, default: false},
    assignedUser: {type: String, default: ''},
    assignedUserName: {type: String, default: 'unassigned'},
    dateCreated: {type: Date, default: Date.now}
});

// Export the Mongoose model
module.exports = mongoose.model('Task', taskSchema);