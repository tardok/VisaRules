// Authentication check
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
if (!currentUser) {
    window.location.href = "index.html";
}

// Display current user
document.addEventListener("DOMContentLoaded", function() {
    const currentUserElement = document.getElementById("currentUser");
    if (currentUserElement && currentUser) {
        currentUserElement.textContent = `Welcome, ${currentUser.username}`;
        
        // Make username clickable
        currentUserElement.addEventListener("click", function() {
            window.location.href = "profile.html";
        });
    }
});

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Navigation function for services
function navigateToService(service) {
    switch(service) {
        case "visa":
            window.location.href = "visa-checker.html";
            break;
        case "posted-worker":
            // Placeholder for future implementation
            alert("Posted Worker Requirements Checker is coming soon!");
            break;
        case "tax":
            // Placeholder for future implementation
            alert("Tax Requirements Checker is coming soon!");
            break;
        default:
            console.log("Unknown service:", service);
    }
}

// Export logs function (placeholder)
function exportLogs() {
    // This would typically redirect to logs.html or trigger a download
    window.open("logs.html", "_blank");
}
