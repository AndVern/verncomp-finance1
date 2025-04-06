$(document).ready(function () {
    function updateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        document.getElementById('current-date').textContent = date;
        document.getElementById('current-time').textContent = time;
    }
    setInterval(updateDateTime, 1000);
    updateDateTime();
    
    $('#register-form').submit(function (e) { 
        e.preventDefault();
        
        const username = $('#username').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if (!username || !password || !confirmPassword) {
            alert('Будь ласка, заповніть всі обов`язкові поля.');
            return;
        }

        if (password !== confirmPassword) {
            $('#password-match').text('Паролі не збігаються.');
            return;
        } else {
            $('#password-match').text('');
        }

        localStorage.setItem('username', username);
        localStorage.setItem('password', password);

        $('#username-display').text(`${username}`);
        $('#logout-button').show();
        $('#register-link').hide();
        $('#registration-form').hide();
        $('#registration-form').after('<p id="registration-success-message" style="color: green; text-align: center;">Реєстрація успішно зроблена</p>');

        fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
            body:
            JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Успіх:', data);
        })
        .catch((error) => {
            console.error('Помилка:', error);
        });
    });

    $('#password-toggle').click(function () { 
        const passwordInput = $('#password');
        const confirmPasswordInput = $('#confirm-password');
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            confirmPasswordInput.attr('type', 'text');
            $(this).text('');
        } else {
            passwordInput.attr('type', 'password');
            confirmPasswordInput.attr('type', 'password');
            $(this).text('');
        }
    });
    $('#confirm-password-toggle').click(function (e) { 
        const passwordInput = $('#password');
        const confirmPasswordInput = $('#confirm-password');
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            confirmPasswordInput.attr('type', 'text');
            $(this).text('Сховати');
        } else {
            passwordInput.attr('type', 'password');
            confirmPasswordInput.attr('type', 'password');
            $(this).text('Показати');
        }
    });

    $('#logout-button').click(function (e) { 
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        $('#registration-form').show(); 
        $('#username-display').text('');
        $('#logout-button').hide();
        $('#register-link').show();
        $('#registration-success-message').remove();
    });

    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        $('#username-display').text(`${savedUsername}`);
        $('#logout-button').show();
        $('#register-link').hide();
        $('#registration-form').hide();
        $('#registration-form').after('<p id="registration-success-message" style="color: green; text-align: center;">Реєстрація успішно зроблена</p>');
    }
});