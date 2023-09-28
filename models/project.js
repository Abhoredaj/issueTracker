const mongoose = require('mongoose');

// Define the schema for the 'Project' model
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
  }],
});

// Create the 'Project' model based on the schema
const Project = mongoose.model('Project', projectSchema);

// Export the 'Project' model to be used in other parts of the application
module.exports = Project;

