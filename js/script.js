// Game object
const gameBoard = (function () {
  const boardArray = [
    ["o", "x", "x"],
    ["?", "o", "?"],
    ["o", "o", "?"],
  ];
  let spacesAvailable = 9;
  const getBoard = () => boardArray;
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

  return {
    getBoard,
    printBoard,
    addToken,
    getSpaceAvailable,
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
  board.printBoard();
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
    board.printBoard();
  };

  const getCurrentPlayer = () => currentPlayer;

  const checkWinnerToken = () => {
    let winnerToken = null;
    // check if there rows with same token
    const boardArr = board.getBoard();
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
      return "tie";
    }
    return winnerToken;
  };

  const getBoardArr = () => board.getBoard();

  return {
    playRound,
    getCurrentPlayer,
    checkWinnerToken,
  };
};

const screenController = () => {
  const game = gameController();
  const boardDiv = document.querySelector(".game-board");
  const updateScreen = () => {
    boardDiv.textContent = "";
    const boardArr = game.getBoardArr();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cellButton = document.createElement("button");
        if (boardArr[i][j] == "x" || boardArr[i][j] == "o") {
          cellButton.classList.add(boardArr[i][j]);
        }
        cellButton.dataset.column = j + 1;
        cellButton.dataset.row = i + 1;
      }
    }

    // initial render
    updateScreen();
  };
};

const controller = screenController();
