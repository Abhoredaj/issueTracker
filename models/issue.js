const mongoose = require('mongoose');

// Define the schema for the 'Issue' model
const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  labels: [String],
  author: String,
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project'  // Reference to the 'Project' model
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

// Create the 'Issue' model based on the schema
const Issue = mongoose.model('Issue', issueSchema);

// Export the 'Issue' model to be used in other parts of the application
module.exports = Issue;
