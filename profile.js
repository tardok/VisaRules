// Authentication check
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
if (!currentUser) {
    window.location.href = "index.html";
}

// Load user profile data
let userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

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
    
    // Load countries for nationality dropdown first, then load profile data
    loadCountries().then(() => {
        loadProfileData();
    });
});

// Logout function
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Export logs function
function exportLogs() {
    window.open("logs.html", "_blank");
}

// Load countries for nationality dropdown
async function loadCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const countries = await response.json();
        
        const nationalitySelect = document.getElementById("nationality");
        const sortedCountries = countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        sortedCountries.forEach(country => {
            const option = document.createElement("option");
            option.value = country.name.common;
            option.textContent = country.name.common;
            nationalitySelect.appendChild(option);
        });
        
        console.log("Countries loaded successfully");
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

// Load existing profile data
function loadProfileData() {
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const nationalitySelect = document.getElementById("nationality");
    
    if (userProfile.firstName) {
        firstNameInput.value = userProfile.firstName;
    }
    
    if (userProfile.lastName) {
        lastNameInput.value = userProfile.lastName;
    }
    
    if (userProfile.nationality) {
        nationalitySelect.value = userProfile.nationality;
        console.log("Setting nationality to:", userProfile.nationality);
    }
}

// Handle profile form submission
document.getElementById("profileForm").addEventListener("submit", function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const nationality = document.getElementById("nationality").value;
    
    console.log("Saving profile with nationality:", nationality);
    
    // Update user profile
    userProfile = {
        firstName: firstName || null,
        lastName: lastName || null,
        nationality: nationality || null,
        updatedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    
    console.log("Profile saved:", userProfile);
    
    // Show success message
    showSuccessMessage();
});

// Show success message
function showSuccessMessage() {
    const successMessage = document.getElementById("successMessage");
    const formSection = document.querySelector(".form-section");
    
    formSection.style.display = "none";
    successMessage.classList.remove("hidden");
    
    // Hide success message after 3 seconds and show form again
    setTimeout(() => {
        successMessage.classList.add("hidden");
        formSection.style.display = "block";
    }, 3000);
}
