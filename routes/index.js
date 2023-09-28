const express = require('express');
const router = express.Router();

// Import the homeController module
const homeController = require('../controllers/homeController');

console.log('router loaded');

// Define a route to handle the root URL '/'
router.get('/', homeController.getProjects);

// Use the '/project' and '/project/issue' routes defined in separate files
router.use('/project', require('./project'));
router.use('/project/issue', require('./issue'));

// Export the router to be used in other parts of the application
module.exports = router;
