// Game object
const gameBoard = (function () {
  let boardArray = [
    ["?", "?", "?"],
    ["?", "?", "?"],
    ["?", "?", "?"],
  ];
  let spacesAvailable = 9;
  const getBoardArray = () => boardArray;
  const printBoard = () => {
    boardArray.forEach((row) => {
      console.log(row);
    });
  };
  const addToken = (row, col, token) => {
    const arrRow = row - 1;
    const arrCol = col - 1;
    if (boardArray[arrRow][arrCol] !== "?") return false; // FAIL
    boardArray[arrRow][arrCol] = token; // SUCCESS
    spacesAvailable--;
    return true;
  };

  const getSpaceAvailable = () => spacesAvailable;

  const cleanBoard = () => {
    boardArray = [
      ["?", "?", "?"],
      ["?", "?", "?"],
      ["?", "?", "?"],
    ];
    spacesAvailable = 9;
  };

  return {
    getBoardArray,
    printBoard,
    addToken,
    getSpaceAvailable,
    cleanBoard,
  };
})();

// Plater object (Factory function)
const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  return {
    getName,
    getToken,
  };
};

gameController = (playerOneName, playerTwoName) => {
  const board = gameBoard;
  const playerOne = Player(playerOneName, "x");
  const playerTwo = Player(playerTwoName, "o");

  //   playerOne starts
  let currentPlayer = playerOne;

  const playRound = (row, col) => {
    const isAdded = board.addToken(row, col, currentPlayer.getToken());
    // check if addition was successful
    if (isAdded) {
      currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
    }
  };

  const getCurrentPlayer = () => currentPlayer;

  const getBoardArr = () => board.getBoardArray();

  const getWinner = () => {
    let winnerToken = "?";
    // check if there rows with same token
    const boardArr = board.getBoardArray();
    for (const row of boardArr) {
      if (
        row.every((elem) => elem === "x") ||
        row.every((elem) => elem === "o")
      ) {
        winnerToken = row[0];
      }
    }
    // check if there is winner with columns
    for (let i = 0; i < 3; i++) {
      if (
        boardArr[0][i] == boardArr[1][i] &&
        boardArr[0][i] == boardArr[2][i]
      ) {
        winnerToken = boardArr[0][i];
        return winnerToken;
      }
    }

    // check winner diagonally
    if (boardArr[0][0] == boardArr[1][1] && boardArr[0][0] == boardArr[2][2]) {
      winnerToken = boardArr[0][0];
    }
    if (boardArr[0][2] == boardArr[1][1] && boardArr[2][0] == boardArr[1][1]) {
      winnerToken = boardArr[0][2];
    }

    if (board.getSpaceAvailable() === 0) {
      winnerToken = "tie";
    }
    return winnerToken;
  };

  const getBoard = () => board;
  const resetGame = () => {
    board.cleanBoard();
    currentPlayer = playerOne;
  };

  return {
    playRound,
    getCurrentPlayer,
    getBoardArr,
    getWinner,
    getBoard,
    resetGame,
  };
};

const screenController = () => {
  let game = gameController();
  const boardDiv = document.querySelector(".game-board");
  const headerElement = document.querySelector(".header__text");
  const restartButton = document.querySelector(".restart-btn");

  restartButton.addEventListener("click", function () {
    game.resetGame();
    updateScreen();
  });

  function cellClickHandler(e) {
    const row = e.target.dataset.row;
    const column = e.target.dataset.column;
    game.playRound(row, column);
    updateScreen();
  }

  const updateScreen = () => {
    console.log("updating screen");
    boardDiv.textContent = "";
    console.log(game.getBoardArr());
    const boardArr = game.getBoardArr();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellButton = document.createElement("button");
        cellButton.classList.add("board-cell");
        if (boardArr[i][j] == "x" || boardArr[i][j] == "o") {
          cellButton.classList.add(boardArr[i][j]);
        }
        cellButton.dataset.column = j + 1;
        cellButton.dataset.row = i + 1;
        // if there is winner don't add event listener
        if (game.getWinner() === "?") {
          cellButton.addEventListener("click", cellClickHandler);
        }
        boardDiv.appendChild(cellButton);
      }
    }

    const winnerToken = game.getWinner();
    if (winnerToken != "?") {
      headerElement.textContent = `${game.getWinner()} wins!`;
    } else {
      headerElement.textContent = `It's ${game
        .getCurrentPlayer()
        .getToken()}'s turn`;
    }
  };

  // initial render
  updateScreen();
};

const controller = screenController();
