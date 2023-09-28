const express = require('express');
const router = express.Router();

// Import the projectController module
const projectController = require('../controllers/projectController');

// Define routes for creating, updating, deleting, and viewing projects

// Route to create a new project
router.post('/create', projectController.createProject);

// Route to view a specific project by its ID
router.get('/:projectId', projectController.getProject);

// Route to update a project by its ID
router.post('/update/:projectId', projectController.updateProject);

// Route to delete a project by its ID
router.post('/delete/:projectId', projectController.deleteProject);

// Export the router to be used in other parts of the application
module.exports = router;

