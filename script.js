// Variables
const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("resetButton");
const cells = document.querySelectorAll(".cell");

let currentPlayer = "X";
let winner = null;
let boardState = ["", "", "", "", "", "", "", "", ""];
let difficulty = "hard";  // Difficulty can be "easy", "medium", "hard"

// Win patterns
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Event listeners
board.addEventListener("click", handleCellClick);
resetButton.addEventListener("click", resetGame);

// After the DOM content has loaded
document.addEventListener('DOMContentLoaded', function() {
    // ... Existing game setup code ...

    // Add an event listener to the difficulty dropdown
    const difficultySelect = document.getElementById('difficulty');
    difficultySelect.addEventListener('change', function(event) {
        difficulty = event.target.value;
        resetGame(); // Optionally reset the game when the difficulty changes
    });
});

// Functions
function handleCellClick(event) {
    const cell = event.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (boardState[cellIndex] === "" && !winner) {
        makeMove(cellIndex, currentPlayer);
        switchPlayer();
    }
}

function makeMove(index, player) {
    boardState[index] = player;
    cells[index].innerHTML = `<span>${player}</span>`;
    cells[index].getElementsByTagName('span')[0].classList.add(player.toLowerCase());

    if (checkWin()) {
        winner = currentPlayer;
        status.textContent = `${winner} wins!`;
    } else if (boardState.every(cell => cell !== "")) {
        winner = "Tie";
        status.textContent = "It's a tie!";
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Turn of ${currentPlayer}`;

    // AI's turn
    if (currentPlayer === "O") {
        setTimeout(() => {
            if (difficulty === "easy") {
                makeRandomMove();
            } else if (difficulty === "medium") {
                if (Math.random() < 0.10) {
                    makeRandomMove();
                } else {
                    const bestMove = findBestMove();
                    if (bestMove != null) makeMove(bestMove, "O");
                }
            } else {
                const bestMove = findBestMove();
                if (bestMove != null) makeMove(bestMove, "O");
            }
            switchPlayer();
        }, Math.random() * (3000 - 1000) + 1000);
    }
}

function makeRandomMove() {
    let emptyCells = boardState.reduce((acc, cell, index) => {
        if (cell === "") acc.push(index);
        return acc;
    }, []);

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex], "O");
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let move = null;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] === "") {
            boardState[i] = "O"; // AI makes a move
            let score = minimax(boardState, 0, false); // Evaluating the board
            boardState[i] = ""; // Undo the move

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    let scores = { 'O': 10, 'X': -10, 'Tie': 0 };
    
    let result = checkWinner();
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            return boardState[a];
        }
    }

    if (boardState.every(cell => cell !== "")) {
        return 'Tie';
    }

    return null;
}

function checkWin() {
    const winner = checkWinner();
    if (winner) {
        highlightWinnerCells(winner);
        return true;
    }
    return false;
}

function highlightWinnerCells(winner) {
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (boardState[a] === winner && boardState[b] === winner && boardState[c] === winner) {
            cells[a].style.backgroundColor = "#27ae60";
            cells[b].style.backgroundColor = "#27ae60";
            cells[c].style.backgroundColor = "#27ae60";
            break;
        }
    }
}

function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    winner = null;
    currentPlayer = "X";
    status.textContent = "Turn of X";

    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.style.backgroundColor = "#ecf0f1";
    });
}

// Initial setup
resetGame();