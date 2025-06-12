const boardElement = document.getElementById('board');
const statusText = document.getElementById('status');
const canvas = document.getElementById('winLine');
const ctx = canvas.getContext('2d');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameMode = localStorage.getItem('gameMode') || 'multi';
let gameOver = false;

canvas.width = 300;
canvas.height = 300;

const winningCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function drawBoard() {
  boardElement.innerHTML = '';
  board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = val;
    cell.addEventListener('click', () => handleMove(i));
    boardElement.appendChild(cell);
  });
  updateStatus();
}

function handleMove(index) {
  if (board[index] || gameOver) return;
  board[index] = currentPlayer;
  drawBoard();
  if (checkWin(currentPlayer)) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameOver = true;
    drawWinLine(checkWin(currentPlayer));
    return;
  } else if (board.every(cell => cell)) {
    statusText.textContent = 'It\'s a draw!';
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus();

  if (gameMode === 'ai' && currentPlayer === 'O' && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let empty = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
  let choice = empty[Math.floor(Math.random() * empty.length)];
  handleMove(choice);
}

function checkWin(player) {
  for (let combo of winningCombos) {
    if (combo.every(i => board[i] === player)) return combo;
  }
  return null;
}

function drawWinLine(combo) {
  const getCenter = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const cellSize = 100;
    const offset = 50; // center of the cell
    return { x: col * cellSize + offset, y: row * cellSize + offset };
  };

  const [start, , end] = combo.map(getCenter);

  ctx.strokeStyle = '#ff69b4';
  ctx.lineWidth = 5;

  let progress = 0;

  function animate() {
    progress += 0.02;
    if (progress > 1) return;

    const currentX = start.x + (end.x - start.x) * progress;
    const currentY = start.y + (end.y - start.y) * progress;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    requestAnimationFrame(animate);
  }

  animate();
}



function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
}

function updateStatus() {
  statusText.textContent = gameOver ? '' : `Player ${currentPlayer}'s turn`;
}

drawBoard();
