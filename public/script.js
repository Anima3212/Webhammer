import { model } from "./js/model.js";
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Define the game grid dimensions
const gridSize = 50;  // 50x50 pixel squares
const numRows = 12;
const numCols = 20;

let degrees = 0;
let distance = 0;

const player1 = new model(new Image(), 0, 0, 20, "tyranid" )
const player2 = new model(new Image(), 1.4, 1.7, 20, "space marine" )

// Load player sprites
player1.image.src = "tyranid.webp";
player2.image.src = "space_marine.jpg";


function drawGrid() {
  for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
          ctx.strokeStyle = '#555';
          ctx.strokeRect(col * gridSize, row * gridSize, gridSize, gridSize);
      }
  }
}

function drawPlayers() {
  ctx.drawImage(player1.image, player1.x * gridSize, player1.y * gridSize, gridSize, gridSize);
  ctx.drawImage(player2.image, player2.x * gridSize, player2.y * gridSize, gridSize, gridSize);
  
}

document.getElementById("submitButton").addEventListener("click", function() {
  // Get values from the input fields
  const number1 = document.getElementById("number1").value;
  const number2 = document.getElementById("number2").value;

  // Store the values in the array
  
      degrees = Number(number1); // Convert string to number
      distance =  Number(number2);  // Convert string to number
  
    movePlayerDown(degrees,distance);
  // Log stored values to console (for debugging)
  console.log(degrees, distance);

  // Clear the input fields
  document.getElementById("form1").reset();
  document.getElementById("form2").reset();
});

function movePlayerDown(degrees, distance) {
  // Convert degrees to radians
  const radians = degrees * (Math.PI / 180);

  // Calculate x and y movement based on polar coordinates
  const dx = distance * Math.cos(radians);
  const dy = -distance * Math.sin(radians);

  // Move the player by the calculated x and y amounts
  player1.move(dx, dy);

  // Debug: Log the calculated values for x and y
  console.log(`Moving player1 by (x: ${dx}, y: ${dy})`);
}

function rollNumber(diceValue, diceDiv, time, delay) {
  // Update the dice display
  diceDiv.textContent = (time % 6) + 1;

  // Check if we've reached the final diceValue and stop
  if (time >= 25 + diceValue) {
    diceDiv.textContent = diceValue; // Set the final result
    return;
  }

  // Increase the time and delay to simulate slowing down
  time++;
  delay += 1.5*Math.log10(time); // Gradually increase the delay to slow down the dice roll

  // Recursively call rollNumber with a delay
  setTimeout(() => rollNumber(diceValue, diceDiv, time, delay), delay);
}

function rollDice() {
  const time = 0;
  const delay = 50; // Initial delay for fast rolling

  // Random number between 1 and 6
  const diceValue = Math.floor(Math.random() * 6) + 1;

  // Get the diceResult div
  const diceDiv = document.getElementById("diceResult");
  
  // Start the rolling effect
  rollNumber(diceValue, diceDiv, time, delay);
}

window.rollDice = rollDice;

// Once the image has loaded, draw it on the canvas
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawPlayers();
  requestAnimationFrame(gameLoop);
}

 
gameLoop();