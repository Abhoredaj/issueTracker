// Initialize Choices.js for the multiple remove button (issue labels)
$(document).ready(function () {
    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5
    });
});

// Initialize Choices.js for the multiple remove filter button (filter by labels)
$(document).ready(function () {
    var multipleCancelButton = new Choices('#choices-multiple-remove-filter-button', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5
    });
});

// Function to format timestamps into a human-readable time ago format
function formatTimeAgo(timestamp) {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const timeDiff = now - createdAt;

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return years === 1 ? "one year ago" : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? "one month ago" : `${months} months ago`;
    } else if (days > 0) {
        return days === 1 ? "one day ago" : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? "one hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? "one minute ago" : `${minutes} minutes ago`;
    } else {
        return "just now";
    }
}

const issueCreatedTimeElements = document.querySelectorAll(".issue-created-time");

// Loop through each element and format the time
issueCreatedTimeElements.forEach((element) => {
    const issueCreatedAt = element.textContent;
    const formattedTime = formatTimeAgo(issueCreatedAt);
    element.textContent = formattedTime;
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Close the modal when the close button is clicked
function populateModal(issue) {
    document.getElementById('issueTitle').textContent = issue.title;
    document.getElementById('issueAuthor').textContent = issue.author;
    document.getElementById('issueDescription').textContent = issue.description;
    document.getElementById('issueCreatedAt').textContent = formatDate(issue.createdAt);
    // Add more details as needed
}

// Function to generate a random color code
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }

// Add click event listener to Info button
document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener("click", () => {
    const issueId = button.getAttribute('data-issue-id');
    const projectId = button.getAttribute('data-project-id');
    // Fetch issue details via an AJAX request
    fetch(`/project/issue/${projectId}/${issueId}`)
        .then(response => response.json())
        .then(data => {
            // Populate modal with issue details
            populateModal(data.issue);
            let labels = data.issue.labels;

            // Get a reference to the label-chips container
            const labelChipsContainer = document.querySelector('.label-chips');
            labelChipsContainer.innerHTML = '';

            // Function to generate a random background color
            // Iterate over the labels and create chips with random background colors
            labels.forEach(label => {
            const chip = document.createElement('span');
            chip.textContent = label;
            chip.classList.add('label-chip');
            chip.style.backgroundColor = getRandomColor();
            labelChipsContainer.appendChild(chip);
            });
        })
        .catch(error => console.error(error));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const showAllIssuesButton = document.getElementById('showAllIssuesButton');

    showAllIssuesButton.addEventListener('click', function() {
        window.location.reload();
    });
});

function updateIssueCards(filteredIssues) {
    const filteredIssueContainer = document.getElementById('filteredIssueContainer');

    // Clear existing filtered issue cards
    filteredIssueContainer.innerHTML = '';

    // Loop through the filtered issues and create/update cards
    filteredIssues.forEach(issue => {
        const card = document.createElement('div');
        card.classList.add('card', 'mb-3'); // Add some margin at the bottom for spacing

        // Create the card content
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header', 'custom-card-header');
        cardHeader.textContent = issue.title; 

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'custom-card-body');

        const authorParagraph = document.createElement('p');
        authorParagraph.innerHTML = `Author: <span id="issueAuthor">${issue.author}</span>`;
        
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.innerHTML = `Description: <span id="issueDescription">${issue.description}</span>`;
        
        const createdAtParagraph = document.createElement('p');
        createdAtParagraph.innerHTML = `Created At: <span id="issueCreatedAt">${formatDate(issue.createdAt)}</span>`;
        
        const labelChipsContainer = document.createElement('div');
        labelChipsContainer.classList.add('label-chips');
        
        // Loop through issue labels and create colored chips
        issue.labels.forEach(label => {
            const chip = document.createElement('span');
            chip.textContent = label;
            chip.classList.add('label-chip');
            chip.style.backgroundColor = getRandomColor(); 
            labelChipsContainer.appendChild(chip);
        });

        // Append the elements to the card body
        cardBody.appendChild(authorParagraph);
        cardBody.appendChild(descriptionParagraph);
        cardBody.appendChild(createdAtParagraph);
        cardBody.appendChild(labelChipsContainer);

        // Append the card content to the card
        card.appendChild(cardHeader);
        card.appendChild(cardBody);

        // Append the card to the filtered issue container
        filteredIssueContainer.appendChild(card);
    });

    // Trigger the modal's opening
    $('#filteredIssueModal').modal('show');
}

document.getElementById('applyFilterButton').addEventListener('click', function () {
    // Get projectId from the data-project-id attribute of the button
    const projectId = this.getAttribute('data-project-id');

    // Get selected labels from the dropdown
    const labelDropdown = document.getElementById('choices-multiple-remove-filter-button');
    const selectedLabels = Array.from(labelDropdown.selectedOptions).map(option => option.value);

    // Perform an AJAX request to get filtered issues based on project ID and labels
    fetch(`/project/issue/json/${projectId}?labels=${selectedLabels.join(',')}`)
        .then(response => response.json())
        .then(data => {
            updateIssueCards(data.filteredIssues);
        })
        .catch(error => console.error(error));

    // Close the modal
    $('#filterLabelModal').modal('hide');
});

// Add event listener to Apply Filter button in the author filter modal
document.getElementById('applyAuthorFilterButton').addEventListener('click', function () {
    const projectId = this.getAttribute('data-project-id');
    const authorName = document.getElementById('authorName').value.trim();

    // Perform an AJAX request to get filtered issues based on project ID and author name
    fetch(`/project/issue/jsonAuthor/${projectId}/${authorName}`)
        .then(response => response.json())
        .then(data => {
            // Update the issue cards on the page based on the received JSON data
            updateIssueCards(data.filteredIssues);
        })
        .catch(error => console.error(error));

    // Close the modal
    $('#filterAuthorModal').modal('hide');
});


document.getElementById('searchButton').addEventListener('click', function () {
    const projectId = this.getAttribute('data-project-id');

    // Get the search criteria from the form
    const searchTitle = document.getElementById('searchTitle').value;
    const searchDescription = document.getElementById('searchDescription').value;

    // Create an object to hold the filter criteria
    const searchData = {
        title: searchTitle,
        description: searchDescription
    };
    // Perform an AJAX request to get filtered issues based on project ID, title, and description
    fetch(`/project/issue/searchJson/${projectId}`, {
        method: 'POST',
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchData)
    })
    .then(response => response.json())
    .then(data => {
        // Update the issue cards on the page based on the received JSON data
        updateIssueCards(data.filteredIssues);
    })
    .catch(error => console.error(error));

    // Close the modal
    $('#Search').modal('hide');
});

