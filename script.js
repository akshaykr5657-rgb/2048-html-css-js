var board;
var score = 0;
const rows = 4;
const columns = 4;

// Run this function when the window loads
window.onload = function() {
    setGame();
}

// Function to set up the game board
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("board").innerHTML = ''; // Clear board for restart

    // Create the tiles in HTML
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            updateTile(tile, board[r][c]);
            document.getElementById("board").append(tile);
        }
    }

    // Generate two initial tiles
    generateNewTile();
    generateNewTile();
}

// Update the appearance of a tile based on its number
function updateTile(tile, num) {
    tile.innerText = "";
    tile.className = "tile"; // Clear class list
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add("tile-" + num.toString());
    }
}

// Listen for arrow key presses
document.addEventListener('keyup', (e) => {
    // Make a copy of the board before the move to check if anything changed
    const boardBeforeMove = JSON.parse(JSON.stringify(board));

    if (e.code == "ArrowLeft") slideLeft();
    else if (e.code == "ArrowRight") slideRight();
    else if (e.code == "ArrowUp") slideUp();
    else if (e.code == "ArrowDown") slideDown();

    // Check if the board state has changed after the move
    if (JSON.stringify(board) !== JSON.stringify(boardBeforeMove)) {
        generateNewTile();
        document.getElementById("score").innerText = score;
        if (isGameOver()) {
            setTimeout(() => alert("Game Over! Score: " + score), 200);
        }
    }
});

// Helper function to filter out zeros from a row/column
function filterZero(row) {
    return row.filter(num => num != 0);
}

// Core slide and merge logic
function slide(row) {
    row = filterZero(row); // Get rid of zeros
    // Merge
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row); // Get rid of new zeros
    // Add zeros back to the end
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

// Update the entire board view based on the 'board' array
function updateBoardView() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, board[r][c]);
        }
    }
}

// --- Movement Functions ---
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        board[r] = slide(board[r]);
    }
    updateBoardView();
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
    }
    updateBoardView();
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        col = slide(col);
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
        }
    }
    updateBoardView();
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]];
        col.reverse();
        col = slide(col);
        col.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
        }
    }
    updateBoardView();
}

// Generate a new tile (2 or 4) in a random empty spot
function generateNewTile() {
    let emptyTiles = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                emptyTiles.push({r, c});
            }
        }
    }
    if (emptyTiles.length === 0) return;

    let randomPos = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomPos.r][randomPos.c] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2

    let tile = document.getElementById(randomPos.r.toString() + "-" + randomPos.c.toString());
    updateTile(tile, board[randomPos.r][randomPos.c]);
}

// Check for game-over condition
function isGameOver() {
    // Check for empty tiles
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    // Check for possible merges
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false; // Check right
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false; // Check down
        }
    }
    return true;
}