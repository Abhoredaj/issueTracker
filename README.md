# Issue Tracker Web Application

The Issue Tracker Web Application is a web-based tool that helps users manage and keep track of issues or tasks within a project. It allows users to create, view, edit, and filter issues by various criteria such as labels, authors, and search terms. This repository contains the source code for the web application. 

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Features

- **Project Overview:**
  - View project details including name, author, and description.
  - Add new issues to the project.

- **Issue Management:**
  - Create, edit, and delete issues.
  - Filter issues by labels, authors, or search terms.
  - View issue details and creation timestamps.
  - Color-coded labels for issues.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/issue-tracker.git
2. Navigate to the project directory:
    cd issue-tracker
3. Install the required dependencies:
    npm install
4. Start the Node.js server:

    node index.js
    
    The server will start on port 8000. You can access the web application in your browser at http://localhost:8000.

## Usage:

- Create a new project or select an existing project.
- Add issues to the project by clicking the "Add Issue" button.
- View, edit, or delete issues by clicking on the issue cards.
- Use the filter options to narrow down the list of displayed issues.
- Search for issues by title and description using the search feature.

## Technologies Used

- **Frontend:**
  - HTML5 and CSS3
  - JavaScript (Client-side)
  - Bootstrap for styling

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB for data storage
  - Mongoose for database modeling
  - EJS (Embedded JavaScript) for dynamic views

## Contributing:

- **Contributions are welcome! If you'd like to contribute to the project, please follow these steps:**
  - Fork the repository.
  - Create a new branch for your feature or bug fix.
  - Make your changes and test them.
  - Commit your changes with clear and concise commit messages.
  - Push your changes to your fork.
  - Submit a pull request to the main repository.

# Project Folder Structure

```bash
│ index.js
│ package-lock.json
│ package.json
│ README.md
│
├───assets
│ ├───css
│ │ home.css
│ │ issue.css
│ │
│ └───js
│ home.js
│ issue.js
│
├───config
│ middleware.js
│ mongoose.js
│
├───controllers
│ homeController.js
│ issueController.js
│ projectController.js
│
├───models
│ issue.js
│ project.js
│
├───routes
│ index.js
│ issue.js
│ project.js
│
└───views
home.ejs
issue.ejs
layout.ejs
_footer.ejs
_header.ejs