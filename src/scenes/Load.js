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

        //NPC ******* NPC ****** ******* NPC ******  ******* NPC ******  ******* NPC ******  
        //dialog box and font
        this.load.image('dbox2', 'images/dialogbox.png');
        this.load.image('player_icon', 'images/icon.png');
        this.load.spritesheet('icon_idle', 'images/icon_idle.png',{frameWidth: 120, frameHeight: 105, startFrame:0, endFrame: 11});
        this.load.spritesheet('icon_talk', 'images/icon_talk.png',{frameWidth: 120, frameHeight: 105, startFrame:0, endFrame: 11});
        this.load.bitmapFont('font', 'dialog/vcr.png', 'dialog/vcr.xml');
        //BACKGROUND
        this.load.spritesheet('shopkeep1', 'images/shopkeep1.png',{frameWidth: 75, frameHeight: 100, startFrame:0, endFrame: 18});
        this.load.spritesheet('shopbg', 'images/shopbganimated.png',{frameWidth: 800, frameHeight: 600, startFrame:0, endFrame: 4});
        //trader NPC
        this.load.json('traderNPC_dialog', 'dialog/traderNPC_dialog.json');
        //big dude
        this.load.spritesheet('shopkeep2', 'images/shopkeep2.png',{frameWidth: 100, frameHeight: 75, startFrame:0, endFrame: 18});
        //cat
        this.load.spritesheet('shopkeep3', 'images/cat.png',{frameWidth: 117, frameHeight: 186, startFrame:0, endFrame: 41});
        //pirate lady
        this.load.spritesheet('shopkeep4', 'images/shopkeep4.png',{frameWidth: 80, frameHeight: 90, startFrame:0, endFrame: 19});
        //bossman
        this.load.spritesheet('boss', 'images/boss.png',{frameWidth: 225, frameHeight: 225, startFrame:0, endFrame: 11});

        //items
        this.load.image('cauldron_item1', 'images/cauldron.png');
        this.load.image('jasmineOil_item2', 'images/jasmine_oil.png');
        this.load.image('rosemaryOil_item3', 'images/rosemary_oil.png');

        //etc TEMP?
        this.load.image('dbox', 'images/dialoguebox.png');
        this.load.image('star', 'images/star.png');
        this.load.image('shillings', 'images/shillings.png');

    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('traderNPC');
    }
}