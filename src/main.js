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
    width: 1280, //1280
    height: 720, //720
    pixelArt: true, //makes pixel art cooler
    //Ooze -> opening scene
    //Overworld -> map scene
    //BrazenBazaar -> dialogue scene
    scene: [Load, Menu, OpeningScene, Overworld, Boss, Shop1, Shop2, Shop3, Shop4]
    //scene:[Load, Menu, TraderNPC, Overworld] //uncomment to playtest certain scenes
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;
let player;
let speed = 150;
let keyF; //interact button
let keyQ;
let keyW;
let lastShopVisited;