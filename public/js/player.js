export class player {
    // Constructor to initialize the properties of the model (image, position, health, and name)
    constructor(goesFirst) {
        this.goesFirst = goesFirst;
        var commandPoints = 0;
    }

    getCommandPoints(){
        return commandPoints;
    }

    startCommandPhase(){
        commandPoints++;
    }
}