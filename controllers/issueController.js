// Import necessary models
const Issue = require('../models/Issue');
const Project = require('../models/Project');

// Controller function to create a new issue for a project
module.exports.createIssue = async (req, res) => {
    // Extract issue details from the request body
    const { title, description, labels, author } = req.body;
    const projectId = req.params.projectId;

    try {
        // Find the project by its ID
        const project = await Project.findById(projectId);
        if (!project) {
            // Return a 404 error if the project is not found
            return res.status(404).send('Project not found');
        }

        // Split and trim labels from the input
        const labelsArray = Array.isArray(labels) ? labels : [labels];
        const newIssue = new Issue({
            title,
            description,
            labels: labelsArray.map(label => label.trim()), // Assuming labels are comma-separated
            author,
            projectId,
        });

        // Save the new issue to the database
        await newIssue.save();

        // Add the new issue's ID to the project's list of issue IDs
        project.issues.push(newIssue._id);
        await project.save();

        // Flash a success message for user feedback
        req.flash('success', 'Issue Created!');
        // Redirect to the project's issue page
        return res.redirect(`/project/issue/${projectId}`);
    } catch (err) {
        // Handle errors by flashing an error message
        req.flash('error', err);
        // Return a 500 Internal Server Error status with a message
        res.status(500).send('Server Error');
    }
};

// Controller function to retrieve an issue by its ID
module.exports.getIssue = async (req, res) => {
    // Extract the issue ID from the request parameters
    const issueId = req.params.issueId;

    try {
        // Find the issue in the database by its ID
        const issue = await Issue.findById(issueId);
        if (!issue) {
            // Return a 404 error if the issue is not found
            return res.status(404).send('Issue not found');
        }

        // Respond with JSON containing the issue details
        res.json({ issue });
    } catch (err) {
        // Handle errors by logging them and returning a 500 status with a message
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Controller function to retrieve all issues for a project and render them as HTML
module.exports.getIssuesByProject = async (req, res) => {
    try {
        // Extract the project ID from the request parameters
        const projectId = req.params.projectId;
        // Find the project in the database and populate its issues
        const project = await Project.findById(projectId).populate('issues');
        if (!project) {
            // Return a 404 error if the project is not found
            return res.status(404).send('Project not found');
        }

        // Extract the project's issues or initialize an empty array
        const issues = project.issues || [];
        // Render the issues as HTML using a template
        res.render('issue', { project, issues, pageTitle: 'Project' });
    } catch (err) {
        // Handle errors by logging them and returning a 500 status with a message
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Controller function to retrieve issues by labels for a project and return them as JSON
module.exports.getIssuesJsonByProject = async (req, res) => {
    try {
        // Extract the project ID from the request parameters
        const projectId = req.params.projectId;
        // Split labels from the query string and convert them to an array
        const labels = req.query.labels.split(',');

        // Find the project in the database and populate its issues
        const project = await Project.findById(projectId).populate('issues');
        if (!project) {
            // Return a 404 error if the project is not found
            return res.status(404).json({ error: 'Project not found' });
        }

        // Extract the project's issues or initialize an empty array
        const issues = project.issues || [];

        // Filter the issues based on label matches
        const filteredIssues = issues.filter(issue => {
            return labels.every(label => issue.labels.includes(label));
        });

        // Respond with JSON containing the filtered issues
        res.json({ filteredIssues });
    } catch (err) {
        // Handle errors by logging them and returning a 500 status with a message
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Controller function to retrieve issues by author name for a project and return them as JSON
module.exports.getIssuesByAuthor = async (req, res) => {
    try {
        // Extract the project ID and author name from the request parameters
        const projectId = req.params.projectId;
        const authorName = req.params.authorName;

        // Find the project in the database and populate its issues
        const project = await Project.findById(projectId).populate('issues');
        if (!project) {
            // Return a 404 error if the project is not found
            return res.status(404).send('Project not found');
        }

        // Extract the project's issues or initialize an empty array
        const issues = project.issues || [];

        // Filter the issues based on author name matches
        const filteredIssues = issues.filter(issue => {
            return issue.author.toLowerCase().startsWith(authorName.toLowerCase());
        });

        // Respond with JSON containing the filtered issues
        res.json({ filteredIssues });
    } catch (err) {
        // Handle errors by logging them and returning a 500 status with a message
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Controller function to retrieve issues by title and description for a project and return them as JSON
module.exports.getIssuesByTitleAndDescription = async (req, res) => {
    try {
        // Extract the project ID, title, and description from the request body
        const projectId = req.params.projectId;
        const { title, description } = req.body;

        // Find the project in the database and populate its issues
        const project = await Project.findById(projectId).populate('issues');
        if (!project) {
            // Return a 404 error if the project is not found
            return res.status(404).send('Project not found');
        }

        // Extract the project's issues or initialize an empty array
        const issues = project.issues || [];

        let titleMatch = null;
        let descriptionMatch = null;

        // Filter issues based on title matches
        if (title) {
            titleMatch = issues.filter(issue =>
                issue.title.toLowerCase().includes(title.toLowerCase())
            );
        }

        // Filter issues based on description matches
        if (description) {
            descriptionMatch = issues.filter(issue =>
                issue.description.toLowerCase().includes(description.toLowerCase())
            );
        }

        // Combine title and description matches if both exist
        if (titleMatch !== null && descriptionMatch !== null) {
            const filteredIssues = titleMatch.filter(issue =>
                descriptionMatch.some(matchedIssue => matchedIssue._id.equals(issue._id))
            );
            return res.json({ filteredIssues });
        } else if (titleMatch != null) {
            return res.json({ filteredIssues: titleMatch });
        } else if (descriptionMatch !== null) {
            return res.json({ filteredIssues: descriptionMatch });
        } else {
            // Return an empty array if no matches were found
            return res.json({ filteredIssues: [] });
        }
    } catch (err) {
        // Handle errors by logging them and returning a 500 status with a message
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
};

// Controller function to update an existing issue
module.exports.updateIssue = async (req, res) => {
    // Extract the issue ID and updated details from the request body
    const issueId = req.params.issueId;
    const { title, description, author } = req.body;

    try {
        // Find the issue to update by its ID
        const issueToUpdate = await Issue.findById(issueId);

        if (!issueToUpdate) {
            // Return a 404 error if the issue is not found
            return res.status(404).json({ error: 'Issue not found' });
        }

        // Update the issue properties if new values are provided
        if (title) {
            issueToUpdate.title = title;
        }

        if (description) {
            issueToUpdate.description = description;
        }

        if (author) {
            issueToUpdate.author = author;
        }

        // Save the updated issue
        await issueToUpdate.save();

        // Flash a success message for user feedback
        req.flash('success', 'Issue Updated!');
        // Redirect to the project's issue page after successful update
        return res.redirect(`/project/issue/${issueToUpdate.projectId}`);
    } catch (err) {
        // Handle errors by flashing an error message
        req.flash('error', err);
        // Return a 500 Internal Server Error status with a message
        res.status(500).send('Server Error');
    }
};

// Controller function to delete an issue
module.exports.deleteIssue = async (req, res) => {
    // Extract the issue ID from the request parameters
    const issueId = req.params.issueId;

    try {
        // Find the issue to delete by its ID
        const issueToDelete = await Issue.findById(issueId);
        if (!issueToDelete) {
            // Return a 404 error if the issue is not found
            return res.status(404).send('Issue not found');
        }

        // Extract the project ID from the issue
        const projectId = issueToDelete.projectId;

        // Find the project by its ID and remove the issue from its list
        const project = await Project.findById(projectId);
        if (project) {
            project.issues.pull(issueId);
            await project.save();
        }

        // Delete the issue itself by its ID
        await Issue.findByIdAndDelete(issueId);

        // Flash a success message for user feedback
        req.flash('success', 'Issue Deleted!');
        // Redirect to the project's issue page after successful deletion
        return res.redirect(`/project/issue/${projectId}`);
    } catch (err) {
        // Handle errors by flashing an error message
        req.flash('error', err);
        // Return a 500 Internal Server Error status with a message
        res.status(500).send('Server Error');
    }
};

  