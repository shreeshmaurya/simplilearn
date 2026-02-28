// Hardcoded admin credentials
const VALID_EMAIL = 'admin@gmail.com';
const VALID_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const resetBtn = document.getElementById('resetBtn');

  // Form submit handler
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let isValid = true;

    // Validate email
    if (!email) {
      showError(emailInput, 'emailError', 'Email address is required.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError(emailInput, 'emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate password
    if (!password) {
      showError(passwordInput, 'passwordError', 'Password is required.');
      isValid = false;
    }

    if (!isValid) return;

    // Check credentials
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      // Store login state
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      alert('Successfully login!');
      window.location.href = 'dashboard.html';
    } else {
      showError(emailInput, 'emailError', 'Invalid email or password.');
      showError(passwordInput, 'passwordError', 'Invalid email or password.');
    }
  });

  // Reset button handler
  resetBtn.addEventListener('click', function () {
    emailInput.value = '';
    passwordInput.value = '';
    clearErrors();
    emailInput.focus();
  });

  // Email validation regex
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Show error on a field
  function showError(input, errorId, message) {
    input.classList.add('is-invalid');
    document.getElementById(errorId).textContent = message;
  }

  // Clear all errors
  function clearErrors() {
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');
  }
});
