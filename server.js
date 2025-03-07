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
  players: {
    1: { ready: false, units: [] },
    2: { ready: false, units: [] }
  }
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

  // Handle grid updates (MOVED INSIDE CONNECTION HANDLER)
  socket.on('place-unit', (data) => {
    if (isValidPlacement(data)) {
      gameState.grid[data.y][data.x] = {
        unit: data.unit,
        player: data.player
      };
      io.emit('game-state', gameState);
    }
  });
  
  socket.on('deploy-army', (player) => {
    gameState.players[player].ready = true;
    if (gameState.players[1].ready && gameState.players[2].ready) {
      io.emit('battle-start');
    }
  });

  // Validation function (INSIDE CONNECTION HANDLER)
  function isValidPlacement(data) {
    return gameState.grid[data.y][data.x] === 'empty';
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});