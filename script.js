const board = document.getElementById('board');
const statusText = document.getElementById('status');

let currentPlayer = 'X';
let gameActive = true;
let cells = Array(9).fill('');

const winningCombinations = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

function drawBoard() {
  board.innerHTML = '';
  cells.forEach((cell, index) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    cellDiv.addEventListener('click', () => handleCellClick(index));
    board.appendChild(cellDiv);
  });
}

function handleCellClick(index) {
  if (!gameActive || cells[index] !== '') return;

  cells[index] = currentPlayer;
  drawBoard();
  checkWinner();
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  if (gameActive) statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      statusText.textContent = `Player ${cells[a]} wins! 🎉`;
      gameActive = false;
      return;
    }
  }

  if (!cells.includes('')) {
    statusText.textContent = `It's a draw! 🤝`;
    gameActive = false;
  }
}

function resetGame() {
  cells = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  drawBoard();
}

drawBoard();
