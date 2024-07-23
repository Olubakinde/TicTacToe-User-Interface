document.getElementById('startButton').addEventListener('click', function() {
    const aiChecked = document.getElementById('checkbox1').checked;
    const humanChecked = document.getElementById('checkbox2').checked;

    if (aiChecked && humanChecked) {
        alert('Please select only one option.');
    } else if (aiChecked) {
        window.location.href = '../tictactoe-AI/index.html'; // Redirect to AI board
    } else if (humanChecked) {
        window.location.href = '../tictactoe-Human/index.html'; // Redirect to Human board
    } else {
        alert('Please select an option.');
    }
});
