
        // Toggle password visibility
            document.addEventListener('DOMContentLoaded', () => {
            const toggle = document.getElementById('togglePassword');
            const password = document.getElementById('password');
            const icon = toggle.querySelector('i');

            toggle.addEventListener('click', () => {
                const isHidden = password.type === 'password' ;
                password.type = isHidden ? 'text' : 'password' ;
                icon.classList.toggle('bi-eye');
                icon.classList.toggle('bi-eye-slash');
            });
        });
