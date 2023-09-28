// Import the Project model
const Project = require('../models/Project');

// Controller function to get the list of projects
module.exports.getProjects = async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await Project.find();
    // Render the 'home' view with the list of projects
    res.render('home', { projects: projects, pageTitle: 'Home' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

