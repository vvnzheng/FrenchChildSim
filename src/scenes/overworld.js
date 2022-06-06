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
        //this.dialogConvo = 0;			// current "conversation"
        this.dialogTyping = false;		// flag to lock player input while text is "typing"
        this.dialogText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing
        //this.dialogLine = 0;	
    }

    create(){
        //sound
        this.game.sound.stopAll();
        this.overworld_soundtrack = this.sound.add('overworldMusic', {loop: true, volume: .3});
        this.time.delayedCall(3000, () => {this.overworld_soundtrack.play();});
        this.sound.play("windSFX", {loop:true, volume: .2});  
        this.runningFX = this.sound.add('runningFX',{loop: false, volume: .2});
        this.dialogFX = this.sound.add('dialogFX',{loop: true, volume: .3});
        this.checklist_open_SFX = this.sound.add('checklist_open', {loop: false, volume: .7});
        this.checklist_close_SFX = this.sound.add('checklist_close', {loop: false, volume: .7});

        //tilemap stuff
        const map = this.make.tilemap({ key: "map"}); //new
        //const map = this.make.tilemap({ key: "map"});
        const tileset = map.addTilesetImage("tileset", "tiles"); //new
        //const tileset = map.addTilesetImage("tileset", "tiles");

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
        aboveLayer.setDepth(1);

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


        this.cow = this.physics.add.sprite(350, 700, "cow").setScale(1.5);
        this.cow.body.immovable = true;
        this.cow.body.setSize(42,26).setOffset(0, 0); 
        
        this.cow1 = this.physics.add.sprite(200, 590, "cow").setScale(1.5);
        this.cow1.body.immovable = true;
        this.cow1.body.setSize(42,26).setOffset(0, 0); 
        
        this.cow2 = this.physics.add.sprite(500, 550, "cow").setScale(1.5);
        this.cow2.body.immovable = true;
        this.cow2.body.setSize(42,26).setOffset(0, 0); 


        this.bunny = this.physics.add.sprite(400, 700, "bunbun").setScale(1.5);
        this.bunny.body.immovable = true;

        this.bunny1 = this.physics.add.sprite(325, 720, "bunbun").setScale(1.5);
        this.bunny1.body.immovable = true;

        this.bunny2 = this.physics.add.sprite(450, 680, "bunbun");
        this.bunny2.body.immovable = true;

        this.bunny3 = this.physics.add.sprite(650, 550, "bunbun");
        this.bunny3.body.immovable = true;

        this.bunny4 = this.physics.add.sprite(390, 525, "bunbun").setScale(1.5);
        this.bunny4.body.immovable = true;
        
        this.bunny5 = this.physics.add.sprite(800, 400, "bunbun");
        this.bunny5.body.immovable = true;

        this.bunny6 = this.physics.add.sprite(850, 450, "bunbun");
        this.bunny6.body.immovable = true;
        
        this.bunny7 = this.physics.add.sprite(1350, 300, "bunbun").setScale(1.5);
        this.bunny7.body.immovable = true;

        //add playyer sprite
        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
        //player = this.physics.add.sprite(400, 750, "player"); //quick overworld testing
        player.body.setSize(20,22).setOffset(4, 10); //player collision shape

        this.clouds = this.add.tileSprite(0,0, game.config.width, game.config.height/1.405, 'clouds').setOrigin(0,0).setScale(2); //1.42
        this.clouds2 = this.add.tileSprite(0,0, game.config.width, game.config.height/1.405, 'clouds2').setOrigin(0,0).setScale(2); //1.42

        
        //variables for door interaction
        //enables collision with player
        this.physics.add.collider(player, worldLayer);
        this.physics.add.collider(player, worldLayer2);
        this.physics.add.collider(player, worldLayer3);
        this.physics.add.collider(player, this.cow);
        this.physics.add.collider(player, this.cow1);
        this.physics.add.collider(player, this.cow2);
        this.physics.add.collider(player, this.bunny);
        this.physics.add.collider(player, this.bunny1);
        this.physics.add.collider(player, this.bunny2);
        this.physics.add.collider(player, this.bunny3);
        this.physics.add.collider(player, this.bunny4);
        this.physics.add.collider(player, this.bunny5);
        this.physics.add.collider(player, this.bunny6);


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
        //cow
        this.anims.create({
            key: 'cow',
            frames:this.anims.generateFrameNumbers('cow',{start: 0, end: 9, first: 0}),
            frameRate: 3,
            loop: -1
        });

        //dbox SETUP
        this.dialogText = this.add.bitmapText(0, 0, this.DBOX_FONT, '', this.TEXT_SIZE).setScale(.5);
        this.nextText = this.add.bitmapText(0, 0, this.DBOX_FONT, '', this.TEXT_SIZE).setScale(.5);
        this.dialogbox_Visible = false;
        this.dialogText.visible = true;
        this.nextText.visible = true;
        this.dialogbox = this.add.sprite(player.x, player.y, 'dbox2').setOrigin(.5, 1.5).setScale(0.35).setDepth(4);
        this.dialogbox.visible = false;
    
        //item checklist
        this.item_checklist_Visible = false;
        this.overlay = this.add.image(player.x, player.y, "alonebg").setDepth(5).setScale(.75);
        this.cauldron = this.add.image(player.x, player.y, "cauldron_item1").setDepth(6).setScale(.5);
        this.jasmineOil = this.add.image(player.x, player.y, "jasmineOil_item2").setDepth(6);
        this.rosemaryOil = this.add.image(player.x, player.y, "rosemaryOil_item3").setDepth(6);
        this.flask = this.add.image(player.x, player.y, "flask2_item4").setDepth(6);
        this.firewood = this.add.image(player.x, player.y, "firewood_item5").setDepth(6);
        this.newspaper = this.add.image(player.x, player.y, "news").setDepth(6).setScale(.4);
        this.wallet = this.add.image(player.x, player.y, "shillings").setDepth(6).setScale(1);

        this.cauldron.alpha = 0;
        this.jasmineOil.alpha = 0;
        this.rosemaryOil.alpha = 0;
        this.flask.alpha = 0;
        this.firewood.alpha = 0;

        this.overlay.visible = false;
        this.cauldron.visible = false;
        this.jasmineOil.visible = false;
        this.rosemaryOil.visible = false;
        this.flask.visible = false;
        this.firewood.visible = false;
        this.newspaper.visible = false;
        this.wallet.visible = false;

        //game camera
        const camera = this.cameras.main;
        this.cameras.main.fadeIn(1000);
        camera.startFollow(player).setZoom(2);//adjust here to zoom camera in or out
        //camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setBackgroundColor(0x222034);
        this.scene_transition = false;
        

        //modified from https://github.com/nathanaltice/Mappy
        this.tutorial = map.createFromObjects("Dialog", {name: "tutorial"});
        this.tutorial3 = map.createFromObjects("Dialog", {name: "tutorial3"});
        this.movement_tutorial = map.createFromObjects("Dialog", {name: "movementinfo"});
        this.shop1_dialog = map.createFromObjects("Dialog", {name: "shop1visited"});
        this.shop2_dialog = map.createFromObjects("Dialog", {name: "shop2visited"});
        this.shop3_dialog = map.createFromObjects("Dialog", {name: "shop3visited"});
        this.shop4_dialog = map.createFromObjects("Dialog", {name: "shop4visited"});
        this.boss_dialog = map.createFromObjects("Dialog", {name: "bossvisited"});
        this.cow_interact = map.createFromObjects("Dialog", {name: "cow"});

        this.physics.world.enable(this.tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.tutorial3, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.movement_tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop1_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop2_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop3_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop4_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.boss_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.cow_interact, Phaser.Physics.Arcade.STATIC_BODY);

        if(tutorial1 == false) {
            this.overworld_dialog(this.tutorial, "Looks like Feline Fragrances is right next door!");
            tutorial1 = true;
        } 
        if(tutorial2 == false) {
            this.overworld_dialog(this.movement_tutorial, "Arrow keys to move. Press [F] key to close dialog box.");
            tutorial2 = true;
        } 
        if(tutorial3 == false) {
            console.log(tutorial3);
            this.overworld_dialog(this.tutorial3, "Press [R] to open and close ITEM CHECKLIST & view current SHILLINGS(money).");
            tutorial3 = true;
        }


        endingTotal = rosemaryOilBought + jasmineOilBought + firewoodBought + flaskBought + cauldronBought;

        if(shop1_visited == true && shop2_visited == true && shop3_visited == true && shop4_visited == true || shillings <= 0 || endGame == true) {
            console.log(endingTotal);
            this.scene_change(this.boss_dialog, 'boss');
        }   

        if(numOfShopsVisited > 0) {
            if(shop3_visited == true && milk_acquired) {
                this.scene_change(this.shop3milk_dialog, 'shop3');
            } else if(shop3_visited == true){
                this.overworld_dialog(this.shop3_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.", true, 'NPC_reentry_SFX');
            } else if(shop3_visited == false) {
                this.scene_change(this.shop3_dialog, 'shop3');
            }
            if(shop1_visited == true) {
                this.overworld_dialog(this.shop1_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.", true, 'NPC_reentry_SFX'); 
            } else if(shop1_visited == false && tutorial == true) {
                this.scene_change(this.shop1_dialog, 'shop1');
            }
            if(shop2_visited == true) {
                this.overworld_dialog(this.shop2_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.", true, 'NPC_reentry_SFX');  
            } else if(shop2_visited == false && tutorial == true) {
                this.scene_change(this.shop2_dialog, 'shop2');
            }      
            if(shop4_visited == true) {
                this.overworld_dialog(this.shop4_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.", true, 'NPC_reentry_SFX');    
            } else if(shop4_visited == false && tutorial == true) {
                this.scene_change(this.shop4_dialog, 'shop4');
            }  
            if(boss_visited == true) {
                this.overworld_dialog(this.boss_dialog, "I'm on a tight schedule. Boss needs these items before the day ends. I still have " + numOfShopsVisited + " more shops to visit.", true, 'NPC_reentry_SFX');  
            } 
        }
        if(shop1_visited == true && shop2_visited == true && shop3_visited == true && shop4_visited == true || shillings <= 0) {
            this.typeText('Okay, I just visited every shop time to head back to the BOSS.');
            endGame = true;
        }
              

        //item interaction
        this.textUI = false;

        if(milk_acquired == false && milk_route) {
            this.text_UI(this.cow.x, this.cow.y, this.cow_interact, "[F] to milk");
        }


        //keyboard inputs
        cursors = this.input.keyboard.createCursorKeys();
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

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
        //console.log(player.x, player.y);      
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

        this.clouds.tilePositionX += 0.01;
        this.clouds2.tilePositionX += 0.017;

        this.cow.anims.play('cow', true);
        this.item_interact('MILK ACQUIRED!', 'milk');

        this.item_checklist(player.x, player.y);
        
        //PLAYER MOVEMENT 
        const prevVelocity = player.body.velocity.clone();
        // Stop any previous movement from the last frame
        player.body.setVelocity(0);
        
        if(this.dialogbox_Visible == true || this.item_checklist_Visible == true || this.scene_transition == true) {
            player.body.setVelocityX(0);
            player.body.setVelocityY(0);
            if(player.anims.stop()) this.runningFX.pause();
            if (prevVelocity.x < 0) player.setTexture("player", "grenouille_walk_side-3");
                else if (prevVelocity.x > 0) player.setTexture("player", "grenouille_walk_side-3");
                else if (prevVelocity.y < 0) player.setTexture("player", "grenouille_walk_up-0");
                else if (prevVelocity.y > 0) player.setTexture("player", "grenouille_walk_down-0");
            this.runningFX.stop();
        } else if(this.dialogbox_Visible == false) {


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

        this.dialogbox.setPosition(player.x, player.y).setOrigin(.5, 1.5);
        this.dialogbox.visible = true;
        this.nextText.visible = true;
        this.dialogText.visible = true;
        this.dialogText.setPosition(this.dialogbox.x - 120, this.dialogbox.y -95);
        this.dialogText.setDepth(5);
        this.nextText.setPosition(player.x, player.y);

        this.tweens.add({targets: [this.dialogbox], scale: {from: 0, to: .35}, alpha: {from: 0, to: 1}, duration: 200, ease: 'Sine.easeOut',});
        this.tweens.add({targets: [this.dialogText, this.nextText], scale: {from: 0, to: .5}, alpha: {from: 0, to: 1}, duration: 400, ease: 'Sine.easeOut',});

        text = 'GRENOUILLE' + ': ' + text; //new

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
                    this.nextText.setDepth(4);
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
        //creates dialogue for player while exploring
        overworld_dialog(obj, text, sfxTF, soundFX) {
            this.physics.add.overlap(player, obj, (obj1, obj2) => {
                this.typeText(text);
                if(sfxTF == true){
                this.sound.play(soundFX, {volume: .7});
                }
                obj2.destroy();
            });
        }

        scene_change(obj, scene) {
            this.physics.add.overlap(player, obj, (obj1) => {
                //this.cameras.main.pan(player.x, player.y - 100);
                this.scene_transition = true;
                this.sound.play('door_openSFX',{loop:false, volume: 1});
                if(this.overworld_soundtrack.isPlaying){
                    this.overworld_soundtrack.stop();
                }
                this.scene.start(scene);
            });
        }
        
        //checklist for game progression
        item_checklist(playerX, playerY) {
            if(this.item_checklist_Visible == false) {
                if(Phaser.Input.Keyboard.JustDown(keyR)) {
                    if (!this.checklist_open_SFX.isPlaying) {
                        this.checklist_open_SFX.play();
                    }
                    this.tweens.add({ targets: [this.overlay], alpha: {from: 0, to: 1}, duration: 100, ease: 'Sine.easeIn',});
                    this.tweens.add({targets: [this.newspaper], scale: {from: 0, to: .4}, duration: 1000, ease: 'Bounce.easeOut',});
                    this.tweens.add({ targets: [this.wallet], scale: {from: .9, to: 1}, duration: 1000, ease: 'Sine.ease', yoyo: true, repeat: -1, });
                    this.tweens.add({ targets: [this.jasmineOil, this.rosemaryOil, this.flask, this.firewood], y: { value: playerY + 70, duration: 1500, ease: 'Bounce.easeOut' }, repeat: 0, });
                    this.tweens.add({ targets: [this.cauldron], y: { value: playerY + 60, duration: 1500, ease: 'Bounce.easeOut' }, repeat: 0, });

                    this.overlay.visible = true;
                    this.cauldron.visible = true;
                    this.jasmineOil.visible = true;
                    this.rosemaryOil.visible = true;
                    this.flask.visible = true;
                    this.firewood.visible = true;
                    this.wallet.visible = true;
                    this.newspaper.visible = true;

                    if(cauldronBought >= 1) {
                        this.cauldron.alpha = 1;
                    } else this.cauldron.alpha = 0.1;

                    if(jasmineOilBought >= 1) {
                        this.jasmineOil.alpha = 1;
                    } else this.jasmineOil.alpha = 0.1;

                    if(rosemaryOilBought >= 1) {
                        this.rosemaryOil.alpha = 1;
                    } else this.rosemaryOil.alpha = 0.1;

                    if(flaskBought >= 1) {
                        this.flask.alpha = 1;
                    } else this.flask.alpha = 0.1;

                    if(firewoodBought >= 1) {
                        this.firewood.alpha = 1;
                    } else this.firewood.alpha = 0.1;

                    //text
                    this.iventory_title_text = this.add.bitmapText(playerX - 96, playerY - 165, this.DBOX_FONT, 'CHECKLIST', this.TEXT_SIZE + 15).setDepth(6);
                    this.ui_text = this.add.bitmapText(playerX - 42, playerY + 145, this.DBOX_FONT, '[R] to close', this.TEXT_SIZE).setScale(.5).setDepth(5).setTint(0xe8c170);
                    this.cauldron_text = this.add.bitmapText(playerX - 228, playerY + 100, this.DBOX_FONT, 'CAULDRON', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.flask_text = this.add.bitmapText(playerX - 117, playerY + 100, this.DBOX_FONT, 'FLASK', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.jasmineOil_text = this.add.bitmapText(playerX - 35, playerY + 100, this.DBOX_FONT, 'JASMINE OIL', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.firewood_text = this.add.bitmapText(playerX + 75, playerY + 100, this.DBOX_FONT, 'FIREWOOD', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.rosemaryOil_text = this.add.bitmapText(playerX + 165, playerY + 100, this.DBOX_FONT, 'ROSEMARY OIL', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    if(shillings < 0){
                        shillings = 0;
                    }
                    this.wallet_title_text = this.add.bitmapText(player.x + 220, player.y + 145, this.DBOX_FONT, shillings + " SHILLINGS", 10).setDepth(5);
                    
                    //item start positioning for tween
                    this.overlay.setPosition(playerX, playerY);
                    this.cauldron.setPosition(playerX - 200, playerY - 75);
                    this.flask.setPosition(playerX - 100, playerY + 0);
                    this.jasmineOil.setPosition(playerX, playerY - 40);
                    this.firewood.setPosition(playerX + 100, playerY - 100);
                    this.rosemaryOil.setPosition(playerX + 200, playerY - 30);
                    this.newspaper.setPosition(playerX -5, playerY - 30);
                    this.wallet.setPosition(player.x + 190, player.y + 150);                   
                    this.item_checklist_Visible = true;
                }
            } else if (this.item_checklist_Visible == true) {
                if(Phaser.Input.Keyboard.JustDown(keyR)) {
                    if (!this.checklist_close_SFX.isPlaying) {
                        this.checklist_close_SFX.play();
                    }
                    this.cauldron_text.destroy();
                    this.jasmineOil_text.destroy();
                    this.rosemaryOil_text.destroy();
                    this.flask_text.destroy();
                    this.firewood_text.destroy();
                    this.iventory_title_text.destroy(); 
                    this.ui_text.destroy();
                    this.wallet_title_text.destroy();

                    this.overlay.visible = false;
                    this.cauldron.visible = false;
                    this.jasmineOil.visible = false;
                    this.rosemaryOil.visible = false;
                    this.flask.visible = false;
                    this.firewood.visible = false;
                    this.newspaper.visible = false;
                    this.wallet.visible = false;
                    this.item_checklist_Visible = false;
                }
            }
        }

        text_UI(objectX, objectY, obj, text) {
            this.physics.add.overlap(player, obj, (obj1, obj2) => {
                this.textUI_text = this.add.bitmapText(objectX - 35, objectY - 40, this.DBOX_FONT, text, this.TEXT_SIZE).setScale(.5).setDepth(5);
                this.textUI = true;
                obj2.destroy();
            });   
        }

        item_interact(text, item_image) {
            if(this.textUI == true && Phaser.Input.Keyboard.JustDown(keyF)) {
                this.item = this.add.image(player.x, player. y - 50, item_image);
                this.textUI_text.setPosition(player.x - 40, player.y - 85);
                this.textUI_text.text = text;
                this.tweens.add({targets: [this.item], scale: {from: 2, to: 4}, duration: 500, ease: 'Sine.easeOut',});
                this.sound.play("itemAquiredSFX", {volume: 0.3});
                this.textUI = false;
                if(item_image == 'milk') {
                    milk_acquired = true;
                }
                this.time.delayedCall(2000, () => {
                    this.textUI_text.destroy();
                    this.tweens.add({targets: [this.item],alpha: {from: 1, to: 0}, duration: 500})
                });
            }
        }
}