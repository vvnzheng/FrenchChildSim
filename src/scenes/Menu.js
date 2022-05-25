class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    create() {
        //this.game.sound.stopAll();
        //play menu soundtrack
        this.soundtrack = this.sound.add('titleScreenMusic', {loop: false, volume: .3});
        this.soundtrack.play();

        //title screen
        this.titleScreen = this.add.sprite(0, -150, 'titleScreen').setOrigin(0,0).setScale(.92);

        this.cameras.main.fadeIn(2000);

        //camera fade in and out to next scene
        this.input.keyboard.once('keydown-SPACE', () => {
        this.cameras.main.fadeOut(2000);
        this.tweens.add({
            targets:  this.soundtrack,
            volume:   0,
            duration: 2000
        });
        })

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.time.delayedCall(1000, () => {
            this.scene.start('openingScene')
            })
        })
    }
}
