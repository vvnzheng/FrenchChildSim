// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Perfume game
// Updated: 6/06/2022
// some code taken and modified from:
/*
https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
https://github.com/nathanaltice/SecretoftheOoze
https://github.com/nathanaltice/Dialogging/
*/

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
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280, //1280
        height: 720, //720
    },    
    pixelArt: true, //makes pixel art cooler

    scene: [Load, Menu, Overworld, Boss, Shop1, Shop2, Shop3, Shop4, Ending]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;
let spacebar;
let player;
let speed = 150;
let keyF; //interact button
let lastShopVisited; //for respawning back to overworld
let numOfShopsVisited = 4; //for dialog
let endGame = false;
let tutorial1 = false;
let tutorial2 = false;
let tutorial3 = false;
let shop1_visited = false;
let shop2_visited = false;
let shop3_visited = false;
let shop4_visited = false;
let boss_visited = false;
let LETTER_TIMER = 15;	// # ms each letter takes to "type" onscreen //default = 20 or 10
let keyR; // opens item inventory in the overworld
let keyQ; //shows how much money you have left
let cameraFadeTime = 1000;
let flaskBought = 0;
let cauldronBought = 0;
let firewoodBought = 0;
let rosemaryOilBought = 0;
let jasmineOilBought = 0;
let tutorial = false;
let shillings = 20;
let milk_acquired = false;
let endingTotal = 0;
let banned_feline = false;
let banned_brazen = false;
let banned_beret = false;
let banned_muscle = false;
