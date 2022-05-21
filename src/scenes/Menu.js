class Menu extends Phaser.Scene {
    constructor(){
        super("menu");
    }

    preload() {
        //load audio
        this.load.audio('titleScreenMusic', './assets/audio/title_screen_music.wav');
        this.load.audio('npcMusic', './assets/audio/npc_music.mp3')
        this.load.audio('overworldMusic', './assets/audio/overworld_music.mp3')
        //menu screen
        this.load.image('titleScreen', 'assets/images/title_screen2.png');
    }

    create() {
        //this.game.sound.stopAll();
        //play menu soundtrack
        this.soundtrack = this.sound.add('titleScreenMusic', {loop: false, volume: .3});
        this.soundtrack.play();


        //title screen
        this.titleScreen = this.add.sprite(0, -150, 'titleScreen').setOrigin(0,0).setScale(.92);

        this.cameras.main.fadeIn(4000);

        cursors = this.input.keyboard.createCursorKeys();

    }

    update() {
        if(cursors.space.isDown){
            //this.sound.play('insertFXhere');
            this.scene.start('openingScene');
            //this.sound.play('menuSelect'); 
            this.game.sound.stopAll();
        }
    }
}
