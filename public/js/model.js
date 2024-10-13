// Exporting a class named 'model', which represents a game character or entity
export class model {
    // Constructor to initialize the properties of the model (image, position, health, and name)
    constructor(image, x, y, health, name) {
        this.image = image;   // The image associated with the model (likely for rendering purposes)
        this.x = x;           // X-coordinate (position on the board/grid)
        this.y = y;           // Y-coordinate (position on the board/grid)
        this.health = health; // Health of the model
        this.name = name;     // Name of the model (e.g., player name or unit type)
    }

    // Method to move the model by a given dx and dy
    move(dx, dy) {
        this.x += dx;  // Adjust the x-coordinate by the delta dx
        this.y += dy;  // Adjust the y-coordinate by the delta dy
        console.log(`${this.name} moved to (${this.x}, ${this.y})`);  // Log movement information
    }

    // Method for attacking a target (another model)
    attack(target) {
        target.health -= 10;  // Reduce the target's health by a fixed value of 10
        console.log(`${this.name} attacked ${target.name}. ${target.name} now has ${target.health} health.`);
        // Log attack information and remaining health of the target
    }

    // Method to calculate the distance between this model and a target using the Euclidean formula
    distFrom(target) {
       return Math.sqrt(Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)); 
       // Return the Euclidean distance between this model and the target
    }

    // Method to check if the target is within range (adjacent), assumed to be a distance of 1
    withinRange(target) {
        // If the distance from the target is greater than 1, return false
        if (this.distFrom(target) > 1) {
            return false;
        } 
        // Otherwise, return true (target is within range)
        else {
            return true;
        }
    }
}
