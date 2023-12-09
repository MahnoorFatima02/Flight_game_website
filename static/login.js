async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
        alert("Login successful");
        // Redirect to the game page or perform other actions
    } else {
        alert("Login failed. Check your credentials.");
    }
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (result.success) {
        alert("Registration successful");
        // Redirect to the game page or perform other actions
    } else {
        alert("Registration failed. Username may already exist.");
    }
}
