// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Perfume game
// Updated: 5/11/2022

// Debugging
'use strict';

const config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,     
    width: 1280,
    height: 720,
    //Ooze -> opening scene
    //Overworld -> map scene
    //BrazenBazaar -> dialogue scene
    scene: [Menu, OpeningScene, Overworld, BrazenBazaar]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;