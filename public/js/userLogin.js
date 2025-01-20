document.addEventListener('DOMContentLoaded', function () {

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

});