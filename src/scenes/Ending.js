class Ending extends Phaser.Scene {
    constructor() {
        super('ending');
        this.DBOX_FONT = 'font';
        this.TEXT_SIZE = 20;
    }

    create() {
        this.endingScreen = this.add.sprite(game.config.width/2, game.config.height/2, 'endingscreen').setScale(1.29);
        this.theEnd = this.add.sprite(game.config.width/2, game.config.height/3.2, 'theend').setScale(1);
        this.soundtrack2 = this.sound.add('windSFX', {loop: true, volume: .2});

        this.credits = this.add.bitmapText(game.config.width/2, game.config.height/1.75, this.DBOX_FONT, "allan: spaghetti code, sound/music, JEAN's dialog, tilemap/start screen art \n\nvivian: Scene Code, TileSprites, Dialogue \n\nnoah: NPC/Player characters, NPC background, Art \n\ncharles: writing", this.TEXT_SIZE).setOrigin(.5).setTint(0xe8c170);
        this.restart_button = this.add.bitmapText(game.config.width/2, 650, this.DBOX_FONT, '[R] to RESTART', 25).setOrigin(.5);

        this.anims.create({
            key: 'endingscreen',
            frames:this.anims.generateFrameNumbers('endingscreen',{start: 0, end: 14, first: 0}),
            frameRate: 10,
            loop: -1
        });

        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        this.endingScreen.anims.play('endingscreen', true);

        if(Phaser.Input.Keyboard.JustDown(keyR)) {

            //reset globals
            
            speed = 150;
            numOfShopsVisited = 4; //for dialog
            endGame = false;
            tutorial1 = false;
            tutorial2 = false;
            tutorial3 = false;
            shop1_visited = false;
            shop2_visited = false;
            shop3_visited = false;
            shop4_visited = false;
            boss_visited = false;
            LETTER_TIMER = 15;	// # ms each letter takes to "type" onscreen //default = 20 or 10
            cameraFadeTime = 1000;
            flaskBought = 0;
            cauldronBought = 0;
            firewoodBought = 0;
            rosemaryOilBought = 0;
            jasmineOilBought = 0;
            tutorial = false;
            shillings = 20;
            milk_acquired = false;
            endingTotal = 0;
            banned_feline = false;
            banned_brazen = false;
            banned_beret = false;
            banned_muscle = false;
            
            this.game.sound.stopAll();
            this.scene.start('menu');
        }
    }

}