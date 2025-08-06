// Simple user storage (in production, this would be a database)
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Check if user is already logged in
if (currentUser) {
    window.location.href = 'app.html';
}

// DOM elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authMessage = document.getElementById('authMessage');

// Form switching functions
function showRegistration() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    clearMessage();
}

function showLogin() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    clearMessage();
}

// Message handling
function showMessage(message, type = 'error') {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
}

function clearMessage() {
    authMessage.style.display = 'none';
    authMessage.textContent = '';
}

// Registration form handler
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (username.length < 3) {
        showMessage('Username must be at least 3 characters long');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters long');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match');
        return;
    }
    
    // Check if username already exists
    if (users.find(user => user.username === username)) {
        showMessage('Username already exists. Please choose a different username.');
        return;
    }
    
    // Create new user
    const newUser = {
        username: username,
        password: password, // In production, this should be hashed
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('Registration successful! Please login.', 'success');
    
    // Clear form and switch to login
    registerForm.reset();
    setTimeout(() => {
        showLogin();
    }, 2000);
});

// Login form handler
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user session
        currentUser = {
            username: user.username,
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect to main app
        setTimeout(() => {
            window.location.href = 'app.html';
        }, 1000);
    } else {
        showMessage('Invalid username or password');
    }
});

// Logout function (will be used in app.html)
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Clear message when user starts typing
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', clearMessage);
}); 