const board = document.getElementById('board');
const statusText = document.getElementById('status');
const winLine = document.getElementById('win-line');

let cells = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function drawBoard() {
  board.innerHTML = '';
  cells.forEach((value, index) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = value;
    cell.addEventListener('click', () => handleClick(index));
    board.appendChild(cell);
  });
}

function handleClick(index) {
  if (!gameActive || cells[index] !== '') return;
  cells[index] = currentPlayer;
  drawBoard();
  checkWinner();

  if (gameActive) {
    currentPlayer = 'O';
    statusText.textContent = `AI's turn...`;
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (!gameActive) return;
  let emptyIndices = cells.map((v, i) => v === '' ? i : null).filter(i => i !== null);

  // Simple AI: win, block, or random
  let move = findBestMove('O') || findBestMove('X') || emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  cells[move] = 'O';
  drawBoard();
  checkWinner();
  if (gameActive) {
    currentPlayer = 'X';
    statusText.textContent = `Player X's turn`;
  }
}

function findBestMove(player) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    const values = [cells[a], cells[b], cells[c]];
    if (values.filter(v => v === player).length === 2 && values.includes('')) {
      return combo[values.indexOf('')];
    }
  }
  return null;
}

function checkWinner() {
  for (let [a, b, c] of winningCombinations) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      statusText.textContent = `Player ${cells[a]} wins! 🎉`;
      gameActive = false;
      drawWinLine(a, c);
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
  statusText.textContent = `Player X's turn`;
  winLine.innerHTML = '';
  drawBoard();
}

function drawWinLine(startIndex, endIndex) {
  const positions = [
    [50, 50], [155, 50], [260, 50],
    [50, 155], [155, 155], [260, 155],
    [50, 260], [155, 260], [260, 260]
  ];

  const [x1, y1] = positions[startIndex];
  const [x2, y2] = positions[endIndex];

  winLine.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
}

drawBoard();
