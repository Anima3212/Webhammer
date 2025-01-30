// app.js
const socket = io();
let selectedFaction = null;
let selectedUnits = [];
const MAX_POINTS = 2000;

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
function confirmFaction() {
  const factionSelect = document.getElementById('faction');
  selectedFaction = factionSelect.value;
  
  if (!selectedFaction) {
    alert("Please select a faction first!");
    return;
  }

  document.getElementById('faction-selection').style.display = 'none';
  document.getElementById('army-building').style.display = 'block';
  populateUnitList();
}

function populateUnitList() {
  const container = document.getElementById('available-units');
  container.innerHTML = '';
  
  UNITS[selectedFaction].forEach(unit => {
    const div = document.createElement('div');
    div.className = 'unit-item';
    div.innerHTML = `
      <span>${unit.name}</span>
      <div class="unit-controls">
        <span>${unit.points} pts</span>
        <button onclick="addUnit('${unit.name}', ${unit.points})">+</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function addUnit(name, points) {
  if (calculateTotalPoints() + points > MAX_POINTS) {
    alert("Maximum points exceeded!");
    return;
  }

  const existingUnit = selectedUnits.find(u => u.name === name);
  if (existingUnit) {
    existingUnit.count++;
  } else {
    selectedUnits.push({ name, points, count: 1 });
  }
  updateSelectedArmy();
}

function removeUnit(name) {
  const unitIndex = selectedUnits.findIndex(u => u.name === name);
  if (unitIndex === -1) return;

  selectedUnits[unitIndex].count--;
  if (selectedUnits[unitIndex].count === 0) {
    selectedUnits.splice(unitIndex, 1);
  }
  updateSelectedArmy();
}

function calculateTotalPoints() {
  return selectedUnits.reduce((total, unit) => total + (unit.points * unit.count), 0);
}

function updateSelectedArmy() {
  const container = document.getElementById('selected-units');
  const totalPoints = calculateTotalPoints();
  
  container.innerHTML = '';
  selectedUnits.forEach(unit => {
    const div = document.createElement('div');
    div.className = 'selected-unit';
    div.innerHTML = `
      <div>
        <strong>${unit.name}</strong>
        <br>${unit.points} pts × ${unit.count}
      </div>
      <div>
        <button onclick="removeUnit('${unit.name}')">−</button>
      </div>
    `;
    container.appendChild(div);
  });

  document.getElementById('total-points').textContent = totalPoints;
  document.getElementById('max-points').textContent = MAX_POINTS;
}

function startGame() {
  if (calculateTotalPoints() === 0) {
    alert("Your army must contain at least one unit!");
    return;
  }
  
  document.querySelector('.army-picker').style.display = 'none';
  document.getElementById('game-grid').style.display = 'block';
  initializeGame();
}

// Game functions
function placeUnit(e) {
  if (!selectedUnits.length) return;
  const x = parseInt(e.target.dataset.x);
  const y = parseInt(e.target.dataset.y);
  socket.emit('place-unit', x, y);
}

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

// Initialize game (placeholder for future expansion)
function initializeGame() {
  // Add any game initialization logic here
}