const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const { DiceRoll } = require('rpg-dice-roller');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Game state
let gameState = {
  grid: Array(10).fill().map(() => Array(10).fill('empty')),
  players: {}
};

// Serve static files
app.use(express.static('public'));

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Send initial game state
  socket.emit('game-state', gameState);

  // Handle dice rolls
  socket.on('roll-dice', (notation) => {
    const roll = new DiceRoll(notation);
    io.emit('dice-result', { player: socket.id, result: roll });
  });

  // Handle grid updates
  socket.on('place-unit', (x, y) => {
    gameState.grid[y][x] = 'unit';
    io.emit('game-state', gameState);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});