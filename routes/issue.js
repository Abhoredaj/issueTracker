const express = require('express');
const router = express.Router();

// Import the issueController module
const issueController = require('../controllers/issueController');

// Define routes for creating, updating, deleting, and viewing issues within a project

// Route to create a new issue within a project
router.post('/create/:projectId', issueController.createIssue);

// Route to get all issues within a project
router.get('/:projectId', issueController.getIssuesByProject);

// Route to get all issues within a project in JSON format
router.get('/json/:projectId', issueController.getIssuesJsonByProject);

// Route to get issues within a project filtered by author's name in JSON format
router.get('/jsonAuthor/:projectId/:authorName', issueController.getIssuesByAuthor);

// Route to search for issues within a project by title and description in JSON format
router.post('/searchJson/:projectId', issueController.getIssuesByTitleAndDescription);

// Route to get a specific issue within a project by its ID
router.get('/:projectId/:issueId', issueController.getIssue);

// Route to update a specific issue within a project by its ID
router.post('/update/:projectId/:issueId', issueController.updateIssue);

// Route to delete a specific issue within a project by its ID
router.post('/delete/:projectId/:issueId', issueController.deleteIssue);

// Export the router to be used in other parts of the application
module.exports = router;

