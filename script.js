// Gameboard Module
const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    const setMark = (index, mark) => {
        if (board[index] === "") {
            board[index] = mark;
            return true;
        }
        return false;
    };

    return { getBoard, setMark, resetBoard };
})();

// Player Factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game Controller Module
const GameController = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const init = (player1Name, player2Name) => {
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        DisplayController.renderBoard();
        DisplayController.setResult(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver) return;
        if (Gameboard.setMark(index, players[currentPlayerIndex].mark)) {
            DisplayController.renderBoard();
            if (checkWin(players[currentPlayerIndex].mark)) {
                DisplayController.setResult(`${players[currentPlayerIndex].name} wins!`);
                gameOver = true;
                return;
            }
            if (checkTie()) {
                DisplayController.setResult("It's a tie!");
                gameOver = true;
                return;
            }
            currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
            DisplayController.setResult(`${players[currentPlayerIndex].name}'s turn`);
        }
    };

    const checkWin = (mark) => {
        const b = Gameboard.getBoard();
        const winPatterns = [
            [0,1,2],[3,4,5],[6,7,8], // rows
            [0,3,6],[1,4,7],[2,5,8], // cols
            [0,4,8],[2,4,6]          // diagonals
        ];
        return winPatterns.some(pattern => pattern.every(i => b[i] === mark));
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    return { init, playTurn };
})();

// Display Controller Module
const DisplayController = (() => {
    const boardDiv = document.getElementById("gameboard");
    const resultDiv = document.getElementById("result");

    const renderBoard = () => {
        boardDiv.innerHTML = "";
        Gameboard.getBoard().forEach((cell, i) => {
            const square = document.createElement("div");
            square.classList.add("square");
            if (cell) square.classList.add("taken");
            square.textContent = cell;
            square.addEventListener("click", () => GameController.playTurn(i));
            boardDiv.appendChild(square);
        });
    };

    const setResult = (message) => {
        resultDiv.textContent = message;
    };

    return { renderBoard, setResult };
})();

// Event Listeners
document.getElementById("startBtn").addEventListener("click", () => {
    const p1 = document.getElementById("player1").value || "Player 1";
    const p2 = document.getElementById("player2").value || "Player 2";
    GameController.init(p1, p2);
});

document.getElementById("restartBtn").addEventListener("click", () => {
    GameController.init("Player 1", "Player 2");
});