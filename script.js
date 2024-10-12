const canvas = document.getElementById('gameBoard');
const ctx = canvas.getContext('2d');

// Define the game grid dimensions
const gridSize = 50;  // 50x50 pixel squares
const numRows = 12;
const numCols = 16;

// Define the player objects
const player1 = { x: 0, y: 0, sprite: new Image(), health: 100 };
const player2 = { x: 15, y: 11, sprite: new Image(), health: 100 };

// Load player sprites
player1.sprite.src = 'assets/tyranid.webp';
player2.sprite.src = 'assets/space_marine.jpg';

// Function to draw the grid
function drawGrid() {
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            ctx.strokeStyle = '#555';
            ctx.strokeRect(col * gridSize, row * gridSize, gridSize, gridSize);
        }
    }
}

// Function to draw the players
function drawPlayers() {
    ctx.drawImage(player1.sprite, player1.x * gridSize, player1.y * gridSize, gridSize, gridSize);
    ctx.drawImage(player2.sprite, player2.x * gridSize, player2.y * gridSize, gridSize, gridSize);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawPlayers();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
let currentPlayer = 1;  // Player 1 starts

// Function to handle player movement
function movePlayer(player) {
    // Placeholder movement logic (for now, just moving right)
    if (player.x < numCols - 1) player.x++;
    updateTurn();
}

// Function to switch turns
function updateTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('turnIndicator').innerText = `Player ${currentPlayer}'s turn`;
}

// Attach event listeners to buttons
document.getElementById('moveBtn').addEventListener('click', () => {
    if (currentPlayer === 1) movePlayer(player1);
    else movePlayer(player2);
});
// Function to handle attacks
function attack() {
    const distance = Math.abs(player1.x - player2.x) + Math.abs(player1.y - player2.y);
    if (distance <= 1) {
        // If players are adjacent, apply damage
        if (currentPlayer === 1) player2.health -= 10;
        else player1.health -= 10;

        // Check for victory
        if (player1.health <= 0 || player2.health <= 0) {
            alert(`Player ${currentPlayer} wins!`);
            resetGame();
        }
    }
    updateTurn();
}

// Attach event listener for attack button
document.getElementById('attackBtn').addEventListener('click', attack);
