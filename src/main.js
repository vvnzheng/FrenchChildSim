// Vivian Zheng, Charles Qi, Noah Kirsch, Allan Moua
// Perfume game
// Updated: 5/11/2022

// Big Brain Debugging
'use strict';

const config = {
    parent: 'phaser-game',  // for info text
    type: Phaser.AUTO,     
    width: 640 ,
    height: 480,
    scene: [ Ooze ]
};

// define game
const game = new Phaser.Game(config);

// globals
let cursors;