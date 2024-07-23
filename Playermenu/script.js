// Retrieve username from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    const storedUsername = localStorage.getItem('name');
    if (storedUsername) {
        document.getElementById('usernameInput').value = storedUsername;
    }
});

document.getElementById('startButton').addEventListener('click', function() {
    const aiChecked = document.getElementById('checkbox1').checked;
    const humanChecked = document.getElementById('checkbox2').checked;
    const username = document.getElementById('usernameInput').value;

    if (aiChecked && humanChecked) {
        alert('Please select only one option.');
    } else if (aiChecked) {
        // Store the username in localStorage
        localStorage.setItem('name', username);
        window.location.href = '../tictactoe-AI/index.html'; // Redirect to AI board
    } else if (humanChecked) {
        // Store the username in localStorage
        localStorage.setItem('name', username);
        window.location.href = '../tictactoe-Human/index.html'; // Redirect to Human board
    } else {
        alert('Please select an option.');
    }
});
