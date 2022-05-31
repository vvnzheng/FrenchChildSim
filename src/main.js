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
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280, //1280
        height: 720, //720
    },    
    pixelArt: true, //makes pixel art cooler
    //Ooze -> opening scene
    //Overworld -> map scene
    //BrazenBazaar -> dialogue scene
    scene: [Load, Menu, OpeningScene, Overworld, Boss, Shop1, Shop2, Shop3, Shop4]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;
let player;
let speed = 150;
let keyF; //interact button
let lastShopVisited; //for respawning back to overworld
let numOfShopsVisited = 4; //for dialog
let endGame = false;
let tutorial1 = false;
let tutorial2 = false;
let shop1_visited = false;
let shop2_visited = false;
let shop3_visited = false;
let shop4_visited = false;
let boss_visited = true;
let cameraFadeTime = 1000;
let LETTER_TIMER = 20;	// # ms each letter takes to "type" onscreen