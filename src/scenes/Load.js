class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        //load path
        this.load.path = './assets/';
        //audio
        this.load.audio('titleScreenMusic', 'audio/title_screen_music.wav');
        this.load.audio('npcMusic', 'audio/npc_music.mp3');
        this.load.audio('overworldMusic', 'audio/overworld_music.mp3');
        this.load.audio('runningFX', 'audio/running.mp3');
        this.load.audio('dialogFX', 'audio/dialogFX.mp3');
        
        //menu screen
        this.load.image('titleScreen', 'images/title_screen2.png');
        
        //overworld
        this.load.image("tiles", "images/overworld_tileset.png");
        this.load.tilemapTiledJSON("map", "overworld.json");
        this.load.atlas("player", "images/grenouille_walk_anim.png", "images/grenouille_walk_anim.json");
        this.load.spritesheet('enter', "images/enterAnimation.png", {frameWidth: 32, frameHeight: 24, startFrame:0, endFrame: 5});

        //NPC scenes
        //dialog box and font
        this.load.image('dbox2', 'images/dialogbox.png');
        this.load.image('player_icon', 'images/icon.png');
        this.load.bitmapFont('font', 'dialog/vcr.png', 'dialog/vcr.xml');
        //trader NPC
        this.load.spritesheet('shopkeep1', 'images/shopkeep1.png',{frameWidth: 75, frameHeight: 100, startFrame:0, endFrame: 18});
        this.load.spritesheet('shopbg', 'images/shopbganimated.png',{frameWidth: 800, frameHeight: 600, startFrame:0, endFrame: 4});
        this.load.json('traderNPC_dialog', 'dialog/traderNPC_dialog.json');



    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('menu');
    }
}