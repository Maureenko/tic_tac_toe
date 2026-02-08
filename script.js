/* --------- Gameboard Module --------- */
const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const setMark = (index, mark) => {
    if (board[index] !== "") return false;
    board[index] = mark;
    return true;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    setMark,
    reset
  };
})();

/* --------- Player Factory --------- */
const Player = (name, mark) => {
  return { name, mark };
};

/* --------- Game Controller --------- */
const gameController = (() => {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;
  let winner = null;
  let winningCombo = [];

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = () => {
    for (const combo of winningCombos) {
      if (combo.every(index => Gameboard.getBoard()[index] === currentPlayer.mark)) {
        winningCombo = combo;
        winner = currentPlayer.name;
        return true;
      }
    }
    return false;
  };

  const checkTie = () => Gameboard.getBoard().every(cell => cell !== "");

  const playRound = (index) => {
    if (gameOver) return;
    if (!Gameboard.setMark(index, currentPlayer.mark)) return;

    if (checkWin()) {
      gameOver = true;
      return;
    }

    if (checkTie()) {
      gameOver = true;
      winner = null;
      winningCombo = [];
      return;
    }

    switchPlayer();
  };

  const resetGame = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
    winner = null;
    winningCombo = [];
  };

  const setPlayerName = (playerNum, name) => {
    if (playerNum === 1) player1.name = name || "Player 1";
    if (playerNum === 2) player2.name = name || "Player 2";
  };

  const getCurrentPlayer = () => currentPlayer.name;
  const isGameOver = () => gameOver;
  const getWinner = () => winner;
  const getWinningCombo = () => winningCombo;

  return {
    playRound,
    resetGame,
    setPlayerName,
    getCurrentPlayer,
    isGameOver,
    getWinner,
    getWinningCombo
  };
})();

/* --------- Display Controller --------- */
const displayController = (() => {
  const boardDiv = document.getElementById("gameboard");
  const statusDiv = document.getElementById("status");
  const restartBtn = document.getElementById("restart");
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");

  // Create squares once
  const squares = [];
  for (let i = 0; i < 9; i++) {
    const square = document.createElement("div");
    square.addEventListener("click", () => {
      gameController.playRound(i);
      render();
    });
    boardDiv.appendChild(square);
    squares.push(square);
  }

  const render = () => {
    const board = Gameboard.getBoard();
    squares.forEach((square, index) => {
      square.textContent = board[index];
      square.classList.remove("highlight");
    });

    // Update status
    if (gameController.isGameOver()) {
      const winner = gameController.getWinner();
      if (winner) {
        statusDiv.innerHTML = `<span>${winner}</span> wins!`;
        // Highlight winning combo
        gameController.getWinningCombo().forEach(i => squares[i].classList.add("highlight"));
      } else {
        statusDiv.textContent = "It's a tie!";
      }
    } else {
      statusDiv.textContent = `${gameController.getCurrentPlayer()}'s turn`;
    }
  };

  // Restart button
  restartBtn.addEventListener("click", () => {
    gameController.resetGame();
    render();
  });

  // Update player names dynamically
  player1Input.addEventListener("input", (e) => {
    gameController.setPlayerName(1, e.target.value);
    render();
  });
  player2Input.addEventListener("input", (e) => {
    gameController.setPlayerName(2, e.target.value);
    render();
  });

  return { render };
})();

// Initial render
displayController.render();
