let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signupForm');

// Show Signup Form
 function showSignup() {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

// Show Login Form
function showLogin() {
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
}