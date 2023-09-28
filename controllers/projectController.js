// Import necessary models
const Project = require('../models/Project');
const Issue = require('../models/Issue');

// Controller function to create a new project
module.exports.createProject = async (req, res) => {
  // Extract project details from the request body
  const { name, description, author } = req.body;
  try {
    // Create a new project instance with the provided data
    const newProject = new Project({ name, description, author });
    // Save the new project to the database
    await newProject.save();
    // Flash a success message for user feedback
    req.flash('success', 'Project Created!');
    // Redirect to the home page after successful project creation
    return res.redirect('/');
  } catch (err) {
    // Handle any errors by flashing an error message
    req.flash('error', err);
    // Return a 500 Internal Server Error status with a message
    res.status(500).send('Server Error');
  }
};

// Controller function to retrieve a project by its ID
module.exports.getProject = async (req, res) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.projectId;
  try {
    // Find the project in the database by its ID
    const project = await Project.findById(projectId);
    // Respond with JSON containing the project details
    res.json({ project });
  } catch (err) {
    // Handle errors by logging them and returning a 500 status with a message
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Controller function to delete a project and its associated issues
module.exports.deleteProject = async (req, res) => {
  // Extract the project ID from the request parameters
  const projectId = req.params.projectId;
  try {
    // Delete all issues associated with the project
    await Issue.deleteMany({ projectId });
    // Delete the project itself by its ID
    await Project.findByIdAndDelete(projectId);
    // Flash a success message for user feedback
    req.flash('success', 'Project and associated issues deleted!');
    // Redirect to the home page after successful deletion
    return res.redirect('/');
  } catch (err) {
    // Handle errors by flashing an error message
    req.flash('error', err);
    // Return a 500 Internal Server Error status with a message
    res.status(500).send('Server Error');
  }
};

// Controller function to update an existing project
module.exports.updateProject = async (req, res) => {
  // Extract the project ID and updated details from the request body
  const projectId = req.params.projectId;
  const { name, description, author } = req.body;

  try {
    // Find the project by its ID
    const project = await Project.findById(projectId);

    // Check if the project exists
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update the project properties if new values are provided
    if (name) {
      project.name = name;
    }

    if (description) {
      project.description = description;
    }

    if (author) {
      project.author = author;
    }

    // Save the updated project
    await project.save();

    // Flash a success message for user feedback
    req.flash('success', 'Project updated!');
    // Redirect to the home page after successful update
    return res.redirect('/');
  } catch (err) {
    // Handle errors by flashing an error message
    req.flash('error', err);
    // Return a 500 Internal Server Error status with a message
    res.status(500).send('Server Error');
  }
};
