let loggedInUsername; // Variable to store the logged-in username
async function login() {
    var audio = document.getElementById('buttonClickSound');
    audio.play();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/loginpage/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
        alert("Login successful");
        loggedInUsername = username; // Save the username
        localStorage.setItem('loggedInUsername', loggedInUsername);
        window.location.href = '/mainpage';
    } else {
        alert("Login failed. Check your credentials.");
    }
}

async function register() {
    var audio = document.getElementById('buttonClickSound');
    audio.play();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/loginpage/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
        alert("Registration successful");
        loggedInUsername = username; // Save the username
        localStorage.setItem('loggedInUsername', loggedInUsername);
        window.location.href = '/mainpage';
    } else {
        alert("Registration failed. Username may already exist.");
    }
}
