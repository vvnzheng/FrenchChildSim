class Overworld extends Phaser.Scene {
    constructor() {
        super('overworldScene');
        this.DBOX_X = 169;	        // dialog box x-position
        this.DBOX_Y = 460;
        this.TEXT_X = 380;	        // text w/in dialog box x-position
        this.TEXT_Y = 490;	        // text w/in dialog box y-position
        this.DBOX_FONT = 'font';
        this.TEXT_SIZE = 20;
        this.TEXT_MAX_WIDTH = 235;
        //delete maybe
        this.NEXT_TEXT = '[F]';	// text to display for next prompt

        // dialog variables
        this.dialogConvo = 0;			// current "conversation"
        this.dialogTyping = false;		// flag to lock player input while text is "typing"
        this.dialogText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing
        this.dialogLine = 0;	
    }

    create(){
        //sound
        this.game.sound.stopAll();
        this.overworld_soundtrack = this.sound.add('overworldMusic', {loop: true, volume: .3});
        //this.overworld_soundtrack.play();  
        this.runningFX = this.sound.add('runningFX',{loop: false, volume: .2});
        this.dialogFX = this.sound.add('dialogFX',{loop: true, volume: .3});

        //tilemap stuff
        //const map = this.make.tilemap({ key: "map2"}); //new
        const map = this.make.tilemap({ key: "map"});
        //const tileset = map.addTilesetImage("tileset", "tiles2"); //new
        const tileset = map.addTilesetImage("tileset", "tiles");

        //TILED layers
        const belowLayer = map.createLayer("Below Bot Layer", tileset, 0, 0);
        const belowLayer2 = map.createLayer("Below Top Layer", tileset, 0, 0);
        const worldLayer = map.createLayer("World Bot Layer", tileset, 0, 0);
        const worldLayer2 = map.createLayer("World Mid", tileset, 0, 0);
        const worldLayer3 = map.createLayer("World Top Layer", tileset, 0, 0);
        const aboveLayer = map.createLayer("Above Top Layer", tileset, 0, 0);

        //DOOR layers
        const doorToNPC1 = map.createLayer("Door To NPC 1", tileset, 0, 0);
        const doorToNPC2 = map.createLayer("Door To NPC 2", tileset, 0, 0);
        const doorToNPC3 = map.createLayer("Door To NPC 3", tileset, 0, 0);
        const doorToNPC4 = map.createLayer("Door To NPC 4", tileset, 0, 0);
        const doorToNPC5 = map.createLayer("Door To NPC 5", tileset, 0, 0);

        //setup collision with structures and objects created from TILED
        worldLayer.setCollisionByProperty({ collides: true });
        worldLayer2.setCollisionByProperty({ collides: true });
        worldLayer3.setCollisionByProperty({ collides: true });
        doorToNPC1.setCollisionByProperty({collides: true}, true, true);
        doorToNPC2.setCollisionByProperty({collides: true});
        doorToNPC3.setCollisionByProperty({collides: true});
        doorToNPC4.setCollisionByProperty({collides: true});
        doorToNPC5.setCollisionByProperty({collides: true});

        //puts certain layers above player
        aboveLayer.setDepth(10);

        //Spawnpoints
        var spawnPoint = null;
        if(lastShopVisited == 'BOSS') {
            spawnPoint = map.findObject("SpawnPoints", obj => obj.name === "BOSS");
        } else if (lastShopVisited == 'SHOP1'){
            spawnPoint = map.findObject("SpawnPoints", obj => obj.name === "SHOP1");
        } else if (lastShopVisited == 'SHOP2'){
            spawnPoint = map.findObject("SpawnPoints", obj => obj.name === "SHOP2");
        } else if (lastShopVisited == 'SHOP3'){
            spawnPoint = map.findObject("SpawnPoints", obj => obj.name === "SHOP3");
        } else if (lastShopVisited == 'SHOP4'){
            spawnPoint = map.findObject("SpawnPoints", obj => obj.name === "SHOP4");
        }

        //add playyer sprite
        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
        //player = this.physics.add.sprite(450, 300, "player");

        //variables for door interaction
        //enables collision with player
        this.physics.add.collider(player, worldLayer);
        this.physics.add.collider(player, worldLayer2);
        this.physics.add.collider(player, worldLayer3);
        this.physics.add.collider(player, this.doorToNPC1);
        this.physics.add.collider(player, doorToNPC2);
        this.physics.add.collider(player, doorToNPC3);
        this.physics.add.collider(player, doorToNPC4);
        this.physics.add.collider(player, doorToNPC5);

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

        //add door animation
        anims.create({
            key: 'enterAnim',
            frames: anims.generateFrameNumbers('enter', {start: 0, end: 5, first: 0}),
            frameRate: 5
        });

        //dbox SETUP
        this.dialogText = this.add.bitmapText(0, 0, this.DBOX_FONT, '', this.TEXT_SIZE).setScale(.5);
        this.nextText = this.add.bitmapText(0, 0, this.DBOX_FONT, '', this.TEXT_SIZE).setScale(.5);
        this.dialogbox_Visible = false;
        this.dialogText.visible = true;
        this.nextText.visible = true;

        //game camera
        const camera = this.cameras.main;
        this.cameras.main.fadeIn(1000);
        camera.startFollow(player).setZoom(2);//adjust here to zoom camera in or out
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //modified from https://github.com/nathanaltice/Mappy
        this.tutorial = map.createFromObjects("Dialog", {name: "tutorial"});
        this.movement_tutorial = map.createFromObjects("Dialog", {name: "movementinfo"});
        this.shop1_dialog = map.createFromObjects("Dialog", {name: "shop1visited"});
        this.shop2_dialog = map.createFromObjects("Dialog", {name: "shop2visited"});
        this.shop3_dialog = map.createFromObjects("Dialog", {name: "shop3visited"});
        this.shop4_dialog = map.createFromObjects("Dialog", {name: "shop4visited"});
        this.boss_dialog = map.createFromObjects("Dialog", {name: "bossvisited"});

        this.physics.world.enable(this.tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.movement_tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop1_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop2_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop3_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop4_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.boss_dialog, Phaser.Physics.Arcade.STATIC_BODY);

        if(tutorial1 == false) {
            this.overworld_dialog(this.tutorial, "Someone just moved in next door. I should go say hi.");
            tutorial1 = true;
        } 
        if(tutorial2 == false) {
            this.overworld_dialog(this.movement_tutorial, "Arrow keys to move. Press [F] key to close dialog box.");
            tutorial2 = true;
        } 

        if(numOfShopsVisited > 0) {
            if(shop3_visited == true) {
                this.overworld_dialog(this.shop3_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.");
            } 
            if(shop1_visited == true) {
                this.overworld_dialog(this.shop1_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit."); 
            } 
            if(shop2_visited == true) {
                this.overworld_dialog(this.shop2_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.");  
            }         
            if(shop4_visited == true) {
                this.overworld_dialog(this.shop4_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.");    
            }   
            if(boss_visited == true) {
                this.overworld_dialog(this.boss_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.");  
            }     
        }
        if(shop1_visited == true && shop2_visited == true && shop3_visited == true && shop4_visited == true) {
            this.typeText('Okay, I just visited every shop time to head back to the BOSS.');
            endGame = true;
        }


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
        doorToNPC1.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });
        */
    }

    update(){
        
        console.log(this.dialogText.x, this.dialogText.y);      
        //BOSS starting point
        if((player.x >= 450 && player.x <= 475) && player.y == 288){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(endGame == true)
                this.scene.start('boss'); //prob make another SCENE
            //});
        }
        //shop4 brazenbazaar
        if((player.x >= 867 && player.x <= 890) && player.y == 784){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(shop4_visited == false)
                this.scene.start('shop4');
            //});
        }
        //shop1
        if((player.x >= 1300 && player.x <= 1330) && player.y == 896){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {  
            if(shop1_visited == false)            
                this.scene.start('shop1');
            //});
        }
        //shop2 big dude
        if((player.x >= 1748 && player.x <= 1772) && player.y == 192){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(shop2_visited == false)
                this.scene.start('shop2');
            //});
        }
        //shop3 cat
        if((player.x >= 755 && player.x <= 780) && player.y == 288){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(shop3_visited == false)
                this.scene.start('shop3');
            //});
        }

        if(this.dialogbox_Visible == true) {
            if(Phaser.Input.Keyboard.JustDown(keyF) && !this.dialogTyping) {
            
                if(this.dialogbox.visible == true){
                    this.dialogbox.visible = false;
                    //this.player_icon.visible = false;
                    this.dialogbox_Visible = false;
                    this.dialogText.visible = false;
                    this.nextText.visible = false;
                }
            }
        }

        //PLAYER MOVEMENT 
        if(this.dialogbox_Visible == true) {
            player.body.setVelocityX(0);
            player.body.setVelocityY(0);
            player.setTexture("player", "grenouille_walk_down-0")
            this.runningFX.stop();
        } else if(this.dialogbox_Visible == false) {
            //player.body.static = true;
            

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

    typeText(text) {
        this.dialogTyping = true;
        this.dialogbox_Visible = true;
        // clears text for the next dialog
        this.dialogText.text = '';
        this.nextText.text = '';

        this.dialogbox = this.add.sprite(player.x, player.y, 'dbox2').setOrigin(.5, 1.5).setScale(0.35);
        this.dialogbox.visible = true;
        this.nextText.visible = true;
        this.dialogText.visible = true;
        this.dialogText.setPosition(this.dialogbox.x - 120, this.dialogbox.y -95);
        this.dialogText.setDepth(5);
        this.nextText.setPosition(player.x, player.y);
        this.nextText.setDepth(5);
        //player icon and anims
        //this.player_icon = this.add.sprite(this.dialogbox.x, this.dialogbox.y, 'icon_idle').setOrigin(3,-1.45).setScale(.5);
        //this.player_icon.visible = true;
        text = 'GRENOUILLE' + ': ' + text; //new
        //text = `${this.prop.tempFSM.getState().cName}` + ': ' + `${this.prop.tempFSM.getState().text}`; //old
        
        // create a timer to iterate through each letter in the dialog text
        
        let currentChar = 0; 
        this.textTimer = this.time.addEvent({
            delay: LETTER_TIMER,
            repeat: text.length - 1,
            callback: () => { 
                // concatenate next letter from dialogLines
                this.dialogText.text += text[currentChar];
                // advance character position
                currentChar++;
                // check if timer has exhausted its repeats 
                // (necessary since Phaser 3 no longer seems to have an onComplete event)
                if(this.textTimer.getRepeatCount() == 0) {
                    this.nextText = this.add.bitmapText(this.dialogbox.x + 113, this.dialogbox.y - 52, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setScale(0.5).setTint(0xeadb74);
                    // un-lock input
                    this.dialogTyping = false;
                    // destroy timer
                    this.textTimer.destroy();
                    this.dialogFX.stop();
                }
            },
            callbackScope: this // keep Scene context
        });
        
        // set bounds on dialog
        this.dialogText.maxWidth = this.TEXT_MAX_WIDTH;

        //play typewriter sound FX
        if(this.dialogTyping == true){
            if (!this.dialogFX.isPlaying) this.dialogFX.play();
            }
        }

        overworld_dialog(obj, text) {
            this.physics.add.overlap(player, obj, (obj1, obj2) => {
                this.typeText(text);
                obj2.destroy();
            });
        }
}