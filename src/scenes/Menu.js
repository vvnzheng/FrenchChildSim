class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    create() {
        //this.game.sound.stopAll();
        //play menu soundtrack
        this.soundtrack = this.sound.add('titleScreenMusic', {loop: false, volume: .4});
        this.soundtrack2 = this.sound.add('windSFX', {loop: true, volume: .2});
        this.soundtrack.play();
        this.soundtrack2.play();

        //title screen
        this.titleScreen = this.add.sprite(game.config.width/2, game.config.height/2, 'menuscreen').setScale(1.29);
        this.titleScreen2 = this.add.image(game.config.width/2, game.config.height/3.5, 'menuscreen_title');
        this.titleScreen3 = this.add.image(game.config.width/2, game.config.height/1.53, 'menuscreen_press');
        
        /*
        this.cat = this.add.sprite(game.config.width/1.35, 400,'shopkeep3').setOrigin(0).setScale(.3);
        this.anims.create({
            key: 'shopkeep3',
            frames:this.anims.generateFrameNumbers('shopkeep3',{start: 0, end: 41, first: 0}),
            frameRate: 10,
            loop: -1
        });
*/
        this.anims.create({
            key: 'menuscreen',
            frames:this.anims.generateFrameNumbers('menuscreen',{start: 0, end: 14, first: 0}),
            frameRate: 10,
            loop: -1
        });

        this.smokeFX = this.add.sprite(397, 215, game.config.height/2,'smokeFX').setScale(1.29);
        this.anims.create({
            key: 'smokeFX',
            frames:this.anims.generateFrameNumbers('smokeFX',{start: 0, end: 4, first: 0}),
            frameRate: 10,
            loop: -1
        });

        this.tweens.add({
            targets: [this.titleScreen3],
            scale: {from: 1, to: 1.1},
            duration: 1000,
            yoyo: true,
            ease: 'Sine.easeOut',
            repeat: -1,
            });

        this.titleScreen2.setDepth(1);
        this.titleScreen3.setDepth(1);
        //this.cat.setDepth(1);

        this.cameras.main.fadeIn(2000);

        //camera fade in and out to next scene
        this.input.keyboard.once('keydown-SPACE', () => {
        this.cameras.main.fadeOut(2000);
        this.tweens.add({
            targets:  [this.soundtrack, this.soundtrack2],
            volume:   0,
            duration: 2000
        });
        })

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
            this.scene.start('boss');
            })
        })
    }
    update() {
        //animations
        this.titleScreen.anims.play('menuscreen', true);
        this.smokeFX.anims.play('smokeFX', true);
        //this.cat.anims.play('shopkeep3', true);
    }
}
