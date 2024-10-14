import { model } from "./model";

export class unit {
    // Constructor to initialize the properties of the model (image, position, health, and name)
    constructor(modelArray) {
        this.modelArray = modelArray;
        startingArray = modelArray;
    }

    areBattleShocked(){
        if(this.modelArray.length/startingArray.length <.5){
             diceRoll = (Math.floor(Math.random() * 6) + 1) + Math.floor(Math.random() * 6) + 1;
             if(diceRoll < this.modelArray[0].leadership){
                return true
             }
             else{
                return false;
             }
        }
        else{
            return false;
        }
    }
}