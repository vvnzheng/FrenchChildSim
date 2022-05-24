class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene');
    }

    create(){
        //this.scene.start('brazenBazaarScene');

        //sound
        this.game.sound.stopAll();
        this.overworld_soundtrack = this.sound.add('overworldMusic', {loop: true, volume: .3});
        this.overworld_soundtrack.play();  
        this.runningFX = this.sound.add('runningFX',{loop: false, volume: .3});

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

        //puts certain layers above player
        aboveLayer.setDepth(10);

        //Spawnpoints
        const spawnPointNPC1 = map.findObject("SpawnPoints", obj => obj.name === "NPC1");
        const spawnPointNPC2 = map.findObject("SpawnPoints", obj => obj.name === "NPC2");

        //add playyer sprite
        player = this.physics.add.sprite(spawnPointNPC1.x, spawnPointNPC1.y, "player");

        //enables collision with player
        this.physics.add.collider(player, worldLayer);
        this.physics.add.collider(player, worldLayer2);
        this.physics.add.collider(player, worldLayer3);

        //player animations create
        const anims = this.anims;
        anims.create({
            key: "player_walk_down",
            frames: anims.generateFrameNames("player", { prefix: "grenouille_walk_down-", start: 0, end: 7}),
            frameRate: 20,
            repeat: -1
        });
            anims.create({
            key: "player_walk_up",
            frames: anims.generateFrameNames("player", { prefix: "grenouille_walk_up-", start: 0, end: 6}),
            frameRate: 20,
            repeat: -1
        });
            anims.create({
            key: "player_walk_side",
            frames: anims.generateFrameNames("player", { prefix: "grenouille_walk_side-", start: 0, end: 9}),
            frameRate: 20,
            repeat: -1
        });

        //game camera
        const camera = this.cameras.main;
        this.cameras.main.fadeIn(2000);
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
        const prevVelocity = player.body.velocity.clone();

        // Stop any previous movement from the last frame
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-speed);
        } else if (cursors.right.isDown) {
            player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (cursors.up.isDown) {
            player.body.setVelocityY(-speed);
        } else if (cursors.down.isDown) {
            player.body.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        player.body.velocity.normalize().scale(speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (cursors.left.isDown) {
            player.setFlip(true, false);
            player.anims.play("player_walk_side", true);
            if (!this.runningFX.isPlaying) this.runningFX.play();
        } else if (cursors.right.isDown) {
            player.resetFlip();
            player.anims.play("player_walk_side", true);
            if (!this.runningFX.isPlaying) this.runningFX.play();
        } else if (cursors.up.isDown) {
            player.anims.play("player_walk_up", true);
            if (!this.runningFX.isPlaying) this.runningFX.play();
        } else if (cursors.down.isDown) {
            player.anims.play("player_walk_down", true);
            if (!this.runningFX.isPlaying) this.runningFX.play();
        } else {
            if(player.anims.stop()) this.runningFX.pause();
            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) player.setTexture("player", "grenouille_walk_side-3");
            else if (prevVelocity.x > 0) player.setTexture("player", "grenouille_walk_side-3");
            else if (prevVelocity.y < 0) player.setTexture("player", "grenouille_walk_up-0");
            else if (prevVelocity.y > 0) player.setTexture("player", "grenouille_walk_down-0");
        }
    }
}