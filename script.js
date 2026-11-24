
// Get HTML elements
const homeScreen = document.getElementById("homeScreen");
const gameScreen = document.getElementById("gameScreen");
const robotOptions = document.getElementById("robotOptions");

const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const result = document.getElementById("result");

const nextRoundBtn = document.getElementById("nextRound");
const resetScoresBtn = document.getElementById("resetScores");

// Game variables
let currentPlayer = "X";
let gameActive = true;
let gameMode = "friend";
let difficulty = "easy";

let board = ["", "", "", "", "", "", "", "", ""];

let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Winning combinations
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


// Show robot difficulty options
function showRobotOptions() {
    robotOptions.classList.toggle("hidden");
}


// Start game
function startGame(mode, level = "easy") {

    gameMode = mode;
    difficulty = level;

    homeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    if (mode === "robot") {
        document.getElementById("gameMode").innerText =
            "🤖 Playing with Robot (" + level + ")";
        document.getElementById("playerOLabel").innerText = "Robot";
    } else {
        document.getElementById("gameMode").innerText =
            "👯 Two Player Mode";
        document.getElementById("playerOLabel").innerText = "Player O";
    }

    resetRound();
}


// Return to home
function goHome() {

    gameScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");

    robotOptions.classList.add("hidden");
}


// Handle player clicks
cells.forEach((cell, index) => {

    cell.addEventListener("click", function() {

        if (!gameActive || currentPlayer !== "X" ||
            board[index] !== "") {
            return;
        }

        makeMove(index, "X");

        if (!gameActive) return;

        if (gameMode === "robot") {

            currentPlayer = "O";
            statusText.innerText = "Robot is thinking... 🤖";

            setTimeout(robotMove, 550);

        } else {

            currentPlayer = "O";
            statusText.innerText = "Player O's Turn";

        }

    });

});


// Make a move
function makeMove(index, player) {

    board[index] = player;
    cells[index].innerText = player;

    cells[index].disabled = true;

    cells[index].style.color =
        player === "X" ? "#b58acb" : "#81a9d2";

    checkResult();
}


// Check winner or draw
function checkResult() {

    // Check winning patterns
    for (let pattern of winPatterns) {

        let [a, b, c] = pattern;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {

            gameActive = false;

            pattern.forEach(index => {
                cells[index].classList.add("winner");
            });

            scores[board[a]]++;

            updateScores();

            let winnerName;

            if (gameMode === "robot" && board[a] === "O") {
                winnerName = "Robot";
            } else {
                winnerName = board[a] === "X" ? "Player X" : "Player O";
            }

            statusText.innerText = "Game Over! 🎉";
            result.innerText = winnerName + " Wins! 🏆";
            result.classList.remove("hidden");

            disableBoard();

            return true;
        }
    }

    // Check draw
    if (board.every(cell => cell !== "")) {

        gameActive = false;

        scores.draw++;

        updateScores();

        statusText.innerText = "It's a Draw!";
        result.innerText = "Nobody wins this time! 🤝";
        result.classList.remove("hidden");

        return true;
    }

    return false;
}


// Disable all cells
function disableBoard() {

    cells.forEach(cell => {
        cell.disabled = true;
    });

}


// Update scoreboard
function updateScores() {

    document.getElementById("scoreX").innerText = scores.X;
    document.getElementById("scoreO").innerText = scores.O;
    document.getElementById("scoreDraw").innerText = scores.draw;

}


// Robot's turn
function robotMove() {

    if (!gameActive) return;

    let move;

    if (difficulty === "easy") {

        // Random empty cell
        let emptyCells = [];

        board.forEach((value, index) => {
            if (value === "") {
                emptyCells.push(index);
            }
        });

        move = emptyCells[
            Math.floor(Math.random() * emptyCells.length)
        ];

    } else {

        // Smart robot using Minimax
        move = findBestMove();

    }

    makeMove(move, "O");

    if (gameActive) {
        currentPlayer = "X";
        statusText.innerText = "Your Turn (X) 🌸";
    }

}


// Minimax AI
function minimax(testBoard, isMaximizing) {

    // Check winning conditions
    for (let pattern of winPatterns) {

        let [a, b, c] = pattern;

        if (
            testBoard[a] !== "" &&
            testBoard[a] === testBoard[b] &&
            testBoard[b] === testBoard[c]
        ) {

            if (testBoard[a] === "O") return 10;
            if (testBoard[a] === "X") return -10;

        }
    }

    // Draw
    if (testBoard.every(cell => cell !== "")) {
        return 0;
    }

    if (isMaximizing) {

        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {

            if (testBoard[i] === "") {

                testBoard[i] = "O";

                let score = minimax(testBoard, false);

                testBoard[i] = "";

                bestScore = Math.max(bestScore, score);

            }
        }

        return bestScore;

    } else {

        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {

            if (testBoard[i] === "") {

                testBoard[i] = "X";

                let score = minimax(testBoard, true);

                testBoard[i] = "";

                bestScore = Math.min(bestScore, score);

            }
        }

        return bestScore;

    }

}


// Find robot's best move
function findBestMove() {

    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "O";

            let score = minimax(board, false);

            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }

        }
    }

    return bestMove;

}


// Start another round
function resetRound() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";
    gameActive = true;

    cells.forEach(cell => {

        cell.innerText = "";
        cell.disabled = false;
        cell.classList.remove("winner");

    });

    result.classList.add("hidden");

    statusText.innerText = "Your Turn (X) 🌸";

}


// Play Again button
nextRoundBtn.addEventListener("click", resetRound);


// Reset scores
resetScoresBtn.addEventListener("click", function() {

    scores.X = 0;
    scores.O = 0;
    scores.draw = 0;

    updateScores();
    resetRound();

});
