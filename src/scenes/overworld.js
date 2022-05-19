class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene');
    }

    preload() {
        this.load.image("tiles", "/assets/images/overworld_tileset.png");
        this.load.tilemapTiledJSON("map", "/assets/overworld.json");
        //this.load.tilemapCSV("map", "../assets/catastrophi_level2.csv");
        this.load.spritesheet("player", "/assets/images/grenouille.png", {frameWidth: 24, frameHeight: 32, startFrame:0, endFrame: 7});
      }

    create(){
        //this.scene.start('brazenBazaarScene');

        //tilemap stuff
        const map = this.make.tilemap({ key: "map"});
        const tileset = map.addTilesetImage("tileset", "tiles");

        


        //TILED layers
        const belowLayer = map.createLayer("Below Bot Layer", tileset, 0, 0);
        const belowLayer2 = map.createLayer("Below Top Layer", tileset, 0, 0);
        const worldLayer = map.createLayer("World Bot Layer", tileset, 0, 0);
        const worldLayer2 = map.createLayer("World Mid", tileset, 0, 0);
        const worldLayer3 = map.createLayer("World Top Layer", tileset, 0, 0);
        const aboveLayer = map.createLayer("Above Top Layer", tileset, 0, 0);

        //setup collision with structures and objects created from TILED
        worldLayer.setCollisionByProperty({ collides: true });
        worldLayer2.setCollisionByProperty({ collides: true });
        worldLayer3.setCollisionByProperty({ collides: true });

        //puts layer on above player
        aboveLayer.setDepth(10);

        //Spawnpoints
        const spawnPointNPC1 = map.findObject("SpawnPoints", obj => obj.name === "NPC1");
        const spawnPointNPC2 = map.findObject("SpawnPoints", obj => obj.name === "NPC2");

        player = this.physics.add.sprite(spawnPointNPC1.x, spawnPointNPC1.y, "player");

        //enables collision with player
        this.physics.add.collider(player, worldLayer);
        this.physics.add.collider(player, worldLayer2);
        this.physics.add.collider(player, worldLayer3);

        //player animations create
        this.anims.create({
            key: 'walk_Vertical',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 7, first: 0}),
            frameRate: 15
        });

        //game camera
        const camera = this.cameras.main;
        camera.startFollow(player).setZoom(2);//adjust here to zoom camera in or out
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //keyboard inputs
        cursors = this.input.keyboard.createCursorKeys();
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        //collision visualizer
        /*
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        worldLayer2.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        worldLayer3.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        */

    }

    update(){
        // Stop any previous movement from the last frame
        player.body.setVelocity(0);
        const prevVelocity = player.body.velocity.clone();

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-100);
            player.anims.play('walk_Vertical', true);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(100);
            player.anims.play('walk_Vertical', true);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-100);
            player.anims.play('walk_Vertical', true);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(100);
            player.anims.play('walk_Vertical', true);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);
    }
}