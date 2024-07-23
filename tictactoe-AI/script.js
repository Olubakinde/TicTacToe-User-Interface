// Game constants and variables
var board;
var playerO = "O";
var playerX = "X";
var currentPlayer = playerO;
var gameOver = false;
var userWinsData = []; // Array to store user's winning board states

// Function to set up the game board
function setGame(){
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++){
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add('tile');
            if (r === 0 || r === 1){
                tile.classList.add("horizontal-line");
            }
            if (c === 0 || c === 1){
                tile.classList.add("vertical-line");
            }
            tile.addEventListener("click", setTile);
            document.getElementById("board").append(tile);
        }
    }
}

// Function to handle human and AI moves
function setTile() {
    if (gameOver) {
        return;
    }

    let coordinates = this.id.split("-");
    let r = parseInt(coordinates[0]);
    let c = parseInt(coordinates[1]);

    if (board[r][c] !== "") {
        return;
    }

    board[r][c] = currentPlayer;
    this.innerText = currentPlayer;

    checkWinner();

    if (!gameOver) {
        currentPlayer = currentPlayer === playerO ? playerX : playerO;
        // If AI's turn, trigger AI move after human's move
        if (currentPlayer === playerX) {
            setTimeout(trainAI, 1000); // 1 second delay
        }
    }
}

// Function to check for a winner or tie
function checkWinner() {
    // Check horizontally
    for (let r = 0; r < 3; r++){
        if (board[r][0] === board[r][1] && board[r][1] === board[r][2] && board[r][0] !== ''){
            markWinningTiles(r, 0, r, 1, r, 2);
            return;
        }
    }
    // Check vertically
    for (let c = 0; c < 3; c++){
        if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[0][c] !== ''){
            markWinningTiles(0, c, 1, c, 2, c);
            return;
        }
    }

    // Check diagonally
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ''){
        markWinningTiles(0, 0, 1, 1, 2, 2);
        return;
    }

    // Check anti-diagonally
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ""){
        markWinningTiles(0, 2, 1, 1, 2, 0);
        return;
    }

    // Check if all cells are filled (tie case)
    let isTie = true;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === '') {
                isTie = false;
                break;
            }
        }
        if (!isTie) {
            break;
        }
    }
    if (isTie) {
        gameOver = true;
        setTimeout(function() {
            alert("It's a tie!");
        }, 100); // Delay alert to allow last tile to render
    }
}

// Function to mark winning tiles and declare winner
function markWinningTiles(r1, c1, r2, c2, r3, c3) {
    let tile1 = document.getElementById(r1.toString() + "-" + c1.toString());
    let tile2 = document.getElementById(r2.toString() + "-" + c2.toString());
    let tile3 = document.getElementById(r3.toString() + "-" + c3.toString());

    tile1.classList.add("winner");
    tile2.classList.add("winner");
    tile3.classList.add("winner");

    gameOver = true;
    setTimeout(function() {
        alert("Player " + board[r1][c1] + " wins!");
    }, 700); // Delay alert to allow last tile to render
}

// Function to handle AI's move
function aiMove() {
    if (gameOver) {
        return;
    }

    // Check if AI can win in the next move
    let aiWinMove = findWinningMove(playerX);
    if (aiWinMove) {
        makeMove(aiWinMove.r, aiWinMove.c);
        return;
    }

    // Check if human player can win in the next move and block it
    let blockMove = findWinningMove(playerO);
    if (blockMove) {
        makeMove(blockMove.r, blockMove.c);
        return;
    }

    // If no immediate winning or blocking moves, choose a random empty spot
    let emptyTiles = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === '') {
                emptyTiles.push({ r, c });
            }
        }
    }

    if (emptyTiles.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyTiles.length);
        let { r, c } = emptyTiles[randomIndex];
        makeMove(r, c);
    }
}

// Function to find a winning move for a given player
function findWinningMove(player) {
    // Check rows
    for (let r = 0; r < 3; r++) {
        if (board[r][0] === player && board[r][1] === player && board[r][2] === '') {
            return { r, c: 2 };
        }
        if (board[r][0] === player && board[r][2] === player && board[r][1] === '') {
            return { r, c: 1 };
        }
        if (board[r][1] === player && board[r][2] === player && board[r][0] === '') {
            return { r, c: 0 };
        }
    }

    // Check columns
    for (let c = 0; c < 3; c++) {
        if (board[0][c] === player && board[1][c] === player && board[2][c] === '') {
            return { r: 2, c };
        }
        if (board[0][c] === player && board[2][c] === player && board[1][c] === '') {
            return { r: 1, c };
        }
        if (board[1][c] === player && board[2][c] === player && board[0][c] === '') {
            return { r: 0, c };
        }
    }

    // Check diagonals
    if (board[0][0] === player && board[1][1] === player && board[2][2] === '') {
        return { r: 2, c: 2 };
    }
    if (board[0][0] === player && board[2][2] === player && board[1][1] === '') {
        return { r: 1, c: 1 };
    }
    if (board[1][1] === player && board[2][2] === player && board[0][0] === '') {
        return { r: 0, c: 0 };
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === '') {
        return { r: 2, c: 0 };
    }
    if (board[0][2] === player && board[2][0] === player && board[1][1] === '') {
        return { r: 1, c: 1 };
    }
    if (board[1][1] === player && board[2][0] === player && board[0][2] === '') {
        return { r: 0, c: 2 };
    }

    return null;
}

// Function to make a move on the board
function makeMove(r, c) {
    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.innerText = currentPlayer;

    checkWinner();

    currentPlayer = playerO;
}

// Function to restart the game
function restart() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        tile.innerText = '';
        tile.classList.remove("winner");
    }

    gameOver = false;
    currentPlayer = playerO;
}

// Function to train AI based on user victories
function trainAI() {
    // Implement logic to analyze userWinsData and adjust AI strategy
    // For simplicity, we'll just learn to block the last winning pattern observed
    if (userWinsData.length > 0) {
        let lastUserWin = userWinsData[userWinsData.length - 1];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (lastUserWin[r][c] === playerO && board[r][c] === '') {
                    makeMove(r, c);
                    return;
                }
            }
        }
    }
    // If no learning found, make a random move
    aiMove();
}

// Retrieve the username from localStorage
const storedUsername = localStorage.getItem('name');

if (storedUsername) {
    console.log(`Stored Username: ${storedUsername}`);
    // Use the stored username as needed, for example:
    document.getElementById('welcomeMessage').innerText = `${storedUsername}`;
} else {
    console.log('No username found in localStorage.');
}


// Event listener for restart button
document.getElementById("reset").addEventListener("click", restart);

// Initialize the game when the window loads
window.onload = function() {
    setGame();
};
