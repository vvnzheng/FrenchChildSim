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

        this.credits = this.add.bitmapText(game.config.width/2, game.config.height/1.75, this.DBOX_FONT, "allan: spaghetti code, sound/music, JEAN's dialog, tilemap/start screen art \n\nvivian: code, art, writing \n\nnoah: NPC/Player characters, NPC background \n\ncharles: writing", this.TEXT_SIZE).setOrigin(.5).setTint(0xe8c170);
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
            this.game.sound.stopAll();
            this.scene.start('menu');
        }
    }

}