// Function to format a date string into a more readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to populate the project details modal with data
function populateModal(project) {
    document.getElementById('projectName').textContent = project.name;
    document.getElementById('projectAuthor').textContent = project.author;
    document.getElementById('projectDescription').textContent = project.description;
    document.getElementById('projectCreatedAt').textContent = formatDate(project.createdAt);
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

// Add click event listener to Info buttons for project details
document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener("click", () => {
        const projectId = button.getAttribute('data-project-id');
        // Fetch project details via an AJAX request
        fetch(`/project/${projectId}`)
            .then(response => response.json())
            .then(data => {
                // Populate modal with project details
                populateModal(data.project);
            })
            .catch(error => console.error(error));
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

// Get the project's creation timestamp elements and format the time
const projectCreatedTimeElements = document.querySelectorAll(".project-created-time");
projectCreatedTimeElements.forEach((element) => {
    const projectCreatedAt = element.textContent;
    const formattedTime = formatTimeAgo(projectCreatedAt);
    element.textContent = formattedTime;
});
