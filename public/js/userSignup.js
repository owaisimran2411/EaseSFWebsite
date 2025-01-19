document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordError = document.getElementById('password-error');

    function validatePassword(password) {
        if (password.length < 8) {
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            return false;
        }
        if (!/[^a-zA-Z0-9]/.test(password)) {
            return false;
        }
        return true;
    }

    function checkPasswordsMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        if (password !== confirmPassword) {
            passwordError.textContent = "Passwords do not match.";
            return false
        } else {
            passwordError.textContent = ""
            return true
        }
    }
    document.addEventListener('click', function (event) {
        if (event.target.closest('.password-toggle')) {
            const targetId = event.target.closest('.password-toggle').getAttribute('data-target');
            const passwordField = document.getElementById(targetId);
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type)
            const icon = event.target.closest('.password-toggle').querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    })
    signupForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (!checkPasswordsMatch()) {
            return;
        }
        if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = "Password does not meet the requirements, check the help text below for more details"
            return;
        }

        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            emailAddress: document.getElementById('emailAddress').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            password: passwordInput.value,
        };
        try {
            const response = await fetch('/user/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Failed to send signup information")
            }
            const newUser = await response.json();
            alert(`User created successfully with id ${newUser._id}`);
            window.location.href = '/';
        } catch (error) {
            console.error("Failed to create user", error);
            alert("Failed to create a user, please try again")
        }
    });

    confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
    passwordInput.addEventListener('input', function () {
        if (!validatePassword(passwordInput.value)) {
            passwordError.textContent = "Password does not meet the requirements, check the help text below for more details"
        } else {
            passwordError.textContent = ""
        }
        checkPasswordsMatch();
    });
});