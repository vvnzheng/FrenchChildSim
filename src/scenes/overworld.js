class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene');
    }
    create(){
        this.progresstext = this.add.text(game.config.width/2, 30, 'Hello! ', { font: '30px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
    
    }
}