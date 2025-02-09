// app.js
const socket = io();
let selectedFaction = null;
let selectedUnits = [];
const MAX_POINTS = 2000;
let selectedUnit = null;

// Faction unit data
const UNITS = {
  space_marines: [
    { name: "Tactical Squad", points: 100 },
    { name: "Terminators", points: 200 },
    { name: "Dreadnought", points: 300 },
    { name: "Land Raider", points: 400 }
  ],
  orks: [
    { name: "Boyz Mob", points: 80 },
    { name: "Nobz Squad", points: 120 },
    { name: "Deff Dread", points: 250 },
    { name: "Battlewagon", points: 350 }
  ]
};
const players = {
  1: {
    faction: null,
    units: [],
    points: 0,
    deployed: false,
    color: '#cc0000'
  },
  2: {
    faction: null,
    units: [],
    points: 0,
    deployed: false,
    color: '#4444ff'
  }
};


// Initialize grid on page load
createGrid();

// Grid creation
function createGrid() {
  const grid = document.getElementById('grid');
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.addEventListener('click', placeUnit);
      grid.appendChild(cell);
    }
  }
}

// Army building functions
function confirmFaction(player) {
  const factionSelect = document.querySelector(`.faction[data-player="${player}"]`);
  players[player].faction = factionSelect.value;

  if (!players[player].faction) {
    alert("Please select a faction first!");
    return;
  }

  document.getElementById(`player${player}-faction-selection`).style.display = 'none';
  const armyBuilding = document.getElementById(`player${player}-army-building`);
  armyBuilding.style.display = 'block';
  populateUnitList(player);
}

function populateUnitList(player) {
  const container = document.getElementById(`player${player}-army-building`);
  container.innerHTML = `
    <div class="army-columns">
      <div class="unit-list">
        <h3>Available Units</h3>
        <div id="player${player}-available-units"></div>
      </div>
      <div class="army-status">
        <h3>⛁ Your Army <span id="player${player}-total-points">0</span>/2000 pts</h3>
        <div id="player${player}-selected-units"></div>
        <button onclick="deployArmy(${player})" class="start-button">Deploy Forces</button>
      </div>
    </div>
  `;

  const unitsContainer = document.getElementById(`player${player}-available-units`);
  UNITS[players[player].faction].forEach(unit => {
    const div = document.createElement('div');
    div.className = 'unit-item';
    div.innerHTML = `
      <span>${unit.name}</span>
      <div class="unit-controls">
        <span>${unit.points} pts</span>
        <button onclick="addUnit(${player}, '${unit.name}', ${unit.points})">+</button>
      </div>
    `;
    unitsContainer.appendChild(div);
  });
}

function addUnit(player, name, points) {
  const playerState = players[player];
  if (playerState.points + points > MAX_POINTS) {
    alert("Maximum points exceeded!");
    return;
  }

  const existingUnit = playerState.units.find(u => u.name === name);
  if (existingUnit) {
    existingUnit.count++;
  } else {
    playerState.units.push({ name, points, count: 1 });
  }
  playerState.points += points;
  updateSelectedArmy(player);
}
function removeUnit(player, name) {
  const playerState = players[player];
  const unitIndex = playerState.units.findIndex(u => u.name === name);
  if (unitIndex === -1) return;

  const unit = playerState.units[unitIndex];
  playerState.points -= unit.points;
  unit.count--;

  if (unit.count === 0) {
    playerState.units.splice(unitIndex, 1);
  }
  updateSelectedArmy(player);
}


function calculateTotalPoints() {
  return selectedUnits.reduce((total, unit) => total + (unit.points * unit.count), 0);
}

function updateSelectedArmy(player) {
  const container = document.getElementById(`player${player}-selected-units`);
  const pointsDisplay = document.getElementById(`player${player}-total-points`);
  
  container.innerHTML = '';
  players[player].units.forEach(unit => {
    const div = document.createElement('div');
    div.className = 'selected-unit';
    div.innerHTML = `
      <div>
        <strong>${unit.name}</strong>
        <br>${unit.points} pts × ${unit.count}
      </div>
      <div>
        <button onclick="removeUnit(${player}, '${unit.name}')">−</button>
      </div>
    `;
    container.appendChild(div);
  });

  pointsDisplay.textContent = players[player].points;
}
function startGame() {
    if (calculateTotalPoints() === 0) {
      alert("Your army must contain at least one unit!");
      return;
    }
    
    document.querySelector('.army-picker').style.display = 'none';
    document.getElementById('game-grid').style.display = 'block';
    initializeGame();
    renderArmyUnits();
  }
  function renderArmyUnits() {
    const container = document.getElementById('army-units');
    container.innerHTML = '';
    
    selectedUnits.forEach(unit => {
      const div = document.createElement('div');
      div.className = 'army-unit';
      div.innerHTML = `
        <strong>${unit.name}</strong>
        <div>${unit.count} remaining</div>
      `;
      
      div.addEventListener('click', () => {
        if (unit.count > 0) {
          selectedUnit = unit;
          document.querySelectorAll('.army-unit').forEach(u => u.classList.remove('selected'));
          div.classList.add('selected');
        }
      });
      
      container.appendChild(div);
    });
  }
  function placeUnit(e) {
    if (!selectedUnit || selectedUnit.count <= 0) {
      alert("Select a unit from your army first!");
      return;
    }
  
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    
    if (isValidPlacement(x, y)) {
      socket.emit('place-unit', { 
        x, 
        y, 
        unit: selectedUnit.name,
        player: socket.id
      });
      
      selectedUnit.count--;
      renderArmyUnits();
    }
  }
  function isValidPlacement(x, y) {
    // Add deployment zone validation if needed
    return true;
  }

// Game functions

function rollD6() {
  socket.emit('roll-dice', '1d6');
}

// Socket listeners
socket.on('game-state', (state) => {
  updateGrid(state.grid);
});

socket.on('dice-result', (result) => {
  const diceDiv = document.getElementById('dice-results');
  diceDiv.innerHTML = `Player rolled: ${result.result}`;
});

function updateGrid(grid) {
  document.querySelectorAll('.grid-cell').forEach(cell => {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);
    cell.className = grid[y][x] === 'unit' ? 'grid-cell unit' : 'grid-cell';
  });
}
function deployArmy(player) {
  if (players[player].points === 0) {
    alert("Your army must contain at least one unit!");
    return;
  }
  
  players[player].deployed = true;
  document.querySelector(`.player${player} .start-button`).disabled = true;
  checkDeployment();
}

function checkDeployment() {
  if (players[1].deployed && players[2].deployed) {
    document.getElementById('battlefield').style.display = 'block';
    initializeGame();
  }
}

    document.querySelectorAll('.grid-cell').forEach(cell => {
      const x = parseInt(cell.dataset.x);
      const y = parseInt(cell.dataset.y);
      const unit = grid[y][x];
      
      cell.className = 'grid-cell';
      cell.innerHTML = '';
      
      if (unit && unit.player === socket.id) {
        cell.classList.add('player-unit');
        cell.innerHTML = '⚔️';
      } else if (unit) {
        cell.classList.add('enemy-unit');
      }
    });
  }
// Initialize game (placeholder for future expansion)
function initializeGame() {
  // Add any game initialization logic here
}