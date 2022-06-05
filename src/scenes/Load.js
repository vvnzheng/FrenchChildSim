class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        //LOADING BAR: https://gamedevacademy.org/creating-a-preloading-screen-in-phaser-3/?a=13
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x172038, 0.8);
        progressBox.fillRect(478, 285, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Helvetica',
                fill: '#ffffff'
            }
        });

        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px Helvetica',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0x73bed3, 1);
            progressBar.fillRect(488, 295, 300 * value, 30);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        //load path
        this.load.path = './assets/';
        //audio
        this.load.audio('titleScreenMusic', 'audio/title_screen_music.mp3');
        this.load.audio('windSFX', 'audio/wind.mp3'); //https://freesound.org/people/le_abbaye_Noirlac/sounds/129428/
        this.load.audio('npcMusic', 'audio/npc_music.mp3');
        this.load.audio('overworldMusic', 'audio/overworld_music.mp3');
        this.load.audio('runningFX', 'audio/running.mp3');
        this.load.audio('dialogFX', 'audio/dialogFX.mp3');
        this.load.audio('itemAquiredSFX', 'audio/itemAquiredSFX.mp3');
        this.load.audio('checklist_close', 'audio/checklist_close.mp3');
        this.load.audio('checklist_open', 'audio/checklist_open.mp3');
        this.load.audio('moneySFX', 'audio/moneySFX.mp3');
        //this.load.audio('NPC_reentry_SFX', 'audio/NPC_reentry_SFX.mp3');
        //this.load.audio('door_exit_SFX', 'audio/door_exit_SFX.mp3');
        
        //menu screen
        //this.load.image('titleScreen', 'images/title_screen2.png'); //old
        this.load.spritesheet('menuscreen', "images/menuscreen.png", {frameWidth: 1024, frameHeight: 576, startFrame:0, endFrame: 14}); //new
        this.load.spritesheet('smokeFX', "images/smokeFX.png", {frameWidth: 80, frameHeight: 114, startFrame:0, endFrame: 4});
        this.load.image('menuscreen_title', 'images/menuscreen_title.png');
        this.load.image('menuscreen_press', 'images/menuscreen_press.png');
        
        //overworld
        //this.load.image("tiles", "images/overworld_tileset.png"); //temp
        this.load.image("tiles2", "images/overworld_tileset2.png"); //new
        //this.load.tilemapTiledJSON("map", "overworld.json"); //temp
        this.load.tilemapTiledJSON("map2", "overworld2.json"); //new
        this.load.atlas("player", "images/grenouille_walk_anim.png", "images/grenouille_walk_anim.json");
        this.load.spritesheet('enter', "images/enterAnimation.png", {frameWidth: 32, frameHeight: 24, startFrame:0, endFrame: 5});

        //tutorial
        this.load.spritesheet('tutorial_WASD', "images/tutorial_WASD.png", {frameWidth: 160, frameHeight: 99, startFrame:0, endFrame: 4});

        //NPC ******* NPC ****** ******* NPC ******  ******* NPC ******  ******* NPC ******  
        //newspaper
        this.load.image('news', 'images/newspaper.png');
        //dialog box and font
        this.load.image('dbox2', 'images/dialogbox.png');
        this.load.image('player_icon', 'images/icon.png');
        this.load.spritesheet('icon_idle', 'images/icon_idle.png',{frameWidth: 120, frameHeight: 105, startFrame:0, endFrame: 11});
        this.load.spritesheet('icon_talk', 'images/icon_talk.png',{frameWidth: 120, frameHeight: 105, startFrame:0, endFrame: 11});
        this.load.bitmapFont('font', 'dialog/vcr.png', 'dialog/vcr.xml');
        //BACKGROUND
        this.load.spritesheet('shopbg', 'images/shopbganimated.png',{frameWidth: 800, frameHeight: 600, startFrame:0, endFrame: 4});
        this.load.image('shopbg2', 'images/shopbg.png');
        //trader NPC
        this.load.spritesheet('shopkeep1', 'images/shopkeep1.png',{frameWidth: 75, frameHeight: 100, startFrame:0, endFrame: 18});
        this.load.json('BeretBoutique_dialog', 'dialog/BeretBoutique_dialog.json');
        //big dude
        this.load.spritesheet('shopkeep2', 'images/shopkeep2.png',{frameWidth: 100, frameHeight: 75, startFrame:0, endFrame: 18});
        this.load.json('MuscleMarket_dialog', 'dialog/MuscleMarket_dialog.json');
        //cat
        this.load.image('catbg', 'images/catbg.png');
        this.load.image('cauldron', 'images/cauldron.png');
        this.load.image('flask', 'images/flask.png');
        this.load.spritesheet('shopkeep3', 'images/cat.png',{frameWidth: 117, frameHeight: 186, startFrame:0, endFrame: 41});
        this.load.json('FelineFragrances_dialog', 'dialog/FelineFragrances_dialog.json');
        //pirate lady
        this.load.spritesheet('shopkeep4', 'images/shopkeep4.png',{frameWidth: 80, frameHeight: 90, startFrame:0, endFrame: 19});
        this.load.json('Brazen_dialog', 'dialog/Brazen_dialog.json');
        //bossman
        this.load.spritesheet('boss', 'images/boss.png',{frameWidth: 225, frameHeight: 225, startFrame:0, endFrame: 11});
        this.load.json('boss_dialog', 'dialog/boss_dialog.json');
        //items
        this.load.image('cauldron_item1', 'images/cauldron.png');
        this.load.image('jasmineOil_item2', 'images/jasmine_oil.png');
        this.load.image('rosemaryOil_item3', 'images/rosemary_oil.png');
        this.load.image('flask2_item4', 'images/flask2.png');
        this.load.image('flask_item4', 'images/flask.png');
        this.load.image('firewood_item5', 'images/firewood.png');

        //etc TEMP?
        this.load.image('dbox', 'images/dialoguebox.png');
        this.load.image('star', 'images/star.png');
        this.load.image('shillings', 'images/shillings.png');
        this.load.image('alonebg', 'images/alonetime.png');
        this.load.image('propsetup', 'images/propsetup.png');

    }

    create() {
        // ...and pass to the next Scene
        this.scene.start('overworldScene');
    }
}