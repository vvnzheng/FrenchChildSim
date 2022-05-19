// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Perfume game
// Updated: 5/11/2022

// Debugging
'use strict';

const config = {
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y:0 }
        }
    },
    parent: 'phaser-game',
    type: Phaser.AUTO,     
    width: 1280,
    height: 720,
    pixelArt: true, //makes pixel art cooler
    //Ooze -> opening scene
    //Overworld -> map scene
    //BrazenBazaar -> dialogue scene
    scene: [Menu, OpeningScene, Overworld, BrazenBazaar]
    //scene:[Overworld] //uncomment to playtest overworld
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;
let player;
let speed = 200;
let keyF; //interact button