// Game constants and variables
var board; // 2D array representing the game board
var playerO = "O"; // Marker for player O
var playerX = "X"; // Marker for player X
var currentPlayer = playerO; // Track the current player, starting with player O
var gameOver = false; // Flag to indicate if the game is over
var userWinsData = []; // Array to store user's winning board states for AI training

// Function to set up the game board
function setGame(){
    // Initialize an empty board with 3x3 grid
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    // Create the game board dynamically using HTML
    for (let r = 0; r < 3; r++){
        for (let c = 0; c < 3; c++){
            let tile = document.createElement("div"); // Create a new div element for each tile
            tile.id = r.toString() + "-" + c.toString(); // Set the id to coordinate of the tile
            tile.classList.add('tile'); // Add 'tile' class for styling

            // Add horizontal and vertical lines for visual separation
            if (r === 0 || r === 1){
                tile.classList.add("horizontal-line");
            }
            if (c === 0 || c === 1){
                tile.classList.add("vertical-line");
            }
            
            // Add event listener to handle tile clicks
            tile.addEventListener("click", setTile);
            document.getElementById("board").append(tile); // Append the tile to the board
        }
    }
}

// Function to handle human and AI moves
function setTile() {
    if (gameOver) {
        return; // Ignore click if game is over
    }

    let coordinates = this.id.split("-"); // Get the coordinates from the tile id
    let r = parseInt(coordinates[0]); // Row index
    let c = parseInt(coordinates[1]); // Column index

    if (board[r][c] !== "") {
        return; // Ignore click if tile is already filled
    }

    board[r][c] = currentPlayer; // Set the tile to the current player's mark
    this.innerText = currentPlayer; // Update tile display

    checkWinner(); // Check if this move results in a win or tie

    if (!gameOver) {
        currentPlayer = currentPlayer === playerO ? playerX : playerO; // Switch player

        // If it's AI's turn, trigger AI move after human's move
        if (currentPlayer === playerX) {
            setTimeout(trainAI, 1000); // 1 second delay for AI move
        }
    }
}

// Function to check for a winner or tie
function checkWinner() {
    // Check horizontally for a win
    for (let r = 0; r < 3; r++){
        if (board[r][0] === board[r][1] && board[r][1] === board[r][2] && board[r][0] !== ''){
            markWinningTiles(r, 0, r, 1, r, 2); // Mark the winning tiles
            return; // Stop checking further
        }
    }
    
    // Check vertically for a win
    for (let c = 0; c < 3; c++){
        if (board[0][c] === board[1][c] && board[1][c] === board[2][c] && board[0][c] !== ''){
            markWinningTiles(0, c, 1, c, 2, c); // Mark the winning tiles
            return; // Stop checking further
        }
    }

    // Check diagonally for a win
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== ''){
        markWinningTiles(0, 0, 1, 1, 2, 2); // Mark the winning tiles
        return; // Stop checking further
    }

    // Check anti-diagonally for a win
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== ""){
        markWinningTiles(0, 2, 1, 1, 2, 0); // Mark the winning tiles
        return; // Stop checking further
    }

    // Check if all cells are filled (tie case)
    let isTie = true;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === '') {
                isTie = false; // Found an empty cell, not a tie
                break;
            }
        }
        if (!isTie) {
            break;
        }
    }
    if (isTie) {
        gameOver = true; // Set game over flag
        setTimeout(function() {
            alert("It's a tie!"); // Alert user of a tie
        }, 100); // Delay alert to allow last tile to render
    }
}

// Function to mark winning tiles and declare winner
function markWinningTiles(r1, c1, r2, c2, r3, c3) {
    let tile1 = document.getElementById(r1.toString() + "-" + c1.toString());
    let tile2 = document.getElementById(r2.toString() + "-" + c2.toString());
    let tile3 = document.getElementById(r3.toString() + "-" + c3.toString());

    tile1.classList.add("winner"); // Highlight the winning tile
    tile2.classList.add("winner"); // Highlight the winning tile
    tile3.classList.add("winner"); // Highlight the winning tile

    gameOver = true; // Set game over flag
    setTimeout(function() {
        alert("Player " + board[r1][c1] + " wins!"); // Alert user of the winner
    }, 700); // Delay alert to allow last tile to render
}

// Function to handle AI's move
function aiMove() {
    if (gameOver) {
        return; // Ignore AI move if game is over
    }

    // Check if AI can win in the next move
    let aiWinMove = findWinningMove(playerX);
    if (aiWinMove) {
        makeMove(aiWinMove.r, aiWinMove.c); // Make winning move
        return;
    }

    // Check if human player can win in the next move and block it
    let blockMove = findWinningMove(playerO);
    if (blockMove) {
        makeMove(blockMove.r, blockMove.c); // Block human player's winning move
        return;
    }

    // If no immediate winning or blocking moves, choose a random empty spot
    let emptyTiles = [];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[r][c] === '') {
                emptyTiles.push({ r, c }); // Add empty tile to the list
            }
        }
    }

    if (emptyTiles.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyTiles.length); // Randomly select an empty tile
        let { r, c } = emptyTiles[randomIndex];
        makeMove(r, c); // Make the random move
    }
}

// Function to find a winning move for a given player
function findWinningMove(player) {
    // Check rows for winning move
    for (let r = 0; r < 3; r++) {
        if (board[r][0] === player && board[r][1] === player && board[r][2] === '') {
            return { r, c: 2 }; // Winning move in the third column
        }
        if (board[r][0] === player && board[r][2] === player && board[r][1] === '') {
            return { r, c: 1 }; // Winning move in the second column
        }
        if (board[r][1] === player && board[r][2] === player && board[r][0] === '') {
            return { r, c: 0 }; // Winning move in the first column
        }
    }

    // Check columns for winning move
    for (let c = 0; c < 3; c++) {
        if (board[0][c] === player && board[1][c] === player && board[2][c] === '') {
            return { r: 2, c }; // Winning move in the third row
        }
        if (board[0][c] === player && board[2][c] === player && board[1][c] === '') {
            return { r: 1, c }; // Winning move in the second row
        }
        if (board[1][c] === player && board[2][c] === player && board[0][c] === '') {
            return { r: 0, c }; // Winning move in the first row
        }
    }

    // Check diagonals for winning move
    if (board[0][0] === player && board[1][1] === player && board[2][2] === '') {
        return { r: 2, c: 2 }; // Winning move in the bottom-right diagonal
    }
    if (board[0][0] === player && board[2][2] === player && board[1][1] === '') {
        return { r: 1, c: 1 }; // Winning move in the center
    }
    if (board[1][1] === player && board[2][2] === player && board[0][0] === '') {
        return { r: 0, c: 0 }; // Winning move in the top-left diagonal
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === '') {
        return { r: 2, c: 0 }; // Winning move in the bottom-left diagonal
    }
    if (board[0][2] === player && board[2][0] === player && board[1][1] === '') {
        return { r: 1, c: 1 }; // Winning move in the center
    }
    if (board[1][1] === player && board[2][0] === player && board[0][2] === '') {
        return { r: 0, c: 2 }; // Winning move in the top-right diagonal
    }

    return null; // No winning move found
}

// Function to make a move on the board
function makeMove(r, c) {
    board[r][c] = currentPlayer; // Set the tile to the current player's mark
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    tile.innerText = currentPlayer; // Update tile display

    checkWinner(); // Check if this move results in a win or tie

    currentPlayer = playerO; // Switch back to player O for the next turn
}

// Function to restart the game
function restart() {
    // Reset the board to its initial state
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        tile.innerText = ''; // Clear tile text
        tile.classList.remove("winner"); // Remove winner highlight
    }

    gameOver = false; // Reset game over flag
    currentPlayer = playerO; // Start again with player O
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
                    makeMove(r, c); // Block the observed winning move
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
    setGame(); // Set up the game board and start the game
};
