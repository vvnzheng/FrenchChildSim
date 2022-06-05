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
        this.overworld_soundtrack.play();
        //this.sound.play("windSFX", {loop:true, volume: .2});  
        this.runningFX = this.sound.add('runningFX',{loop: false, volume: .2});
        this.dialogFX = this.sound.add('dialogFX',{loop: true, volume: .3});
        this.checklist_open_SFX = this.sound.add('checklist_open', {loop: false, volume: .7});
        this.checklist_close_SFX = this.sound.add('checklist_close', {loop: false, volume: .7});
        //this.NPC_reentry_SFX = this.sound.add('NPC_reentry_SFX', {loop: false, volume: .7});
        //this.doorSFX = this.sound.add('door_exit_SFX', {loop: false, volume: .7});

        //tilemap stuff
        const map = this.make.tilemap({ key: "map2"}); //new
        //const map = this.make.tilemap({ key: "map"});
        const tileset = map.addTilesetImage("tileset", "tiles2"); //new
        //const tileset = map.addTilesetImage("tileset", "tiles");

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

        //add playyer sprite
        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "player");
        //player = this.physics.add.sprite(400, 350, "player"); //quick overworld testing

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
      //dbox 
        this.dialogbox = this.add.sprite(player.x, player.y, 'dbox2').setScale(0.75);
        this.dialogbox.visible = false;
    
        //item checklist
        this.item_checklist_Visible = false;
        this.overlay = this.add.image(player.x, player.y, "alonebg").setDepth(5).setScale(.75);
        this.cauldron = this.add.image(player.x, player.y, "cauldron_item1").setDepth(6).setScale(.5);
        this.jasmineOil = this.add.image(player.x, player.y, "jasmineOil_item2").setDepth(6);
        this.rosemaryOil = this.add.image(player.x, player.y, "rosemaryOil_item3").setDepth(6);
        this.flask = this.add.image(player.x, player.y, "flask2_item4").setDepth(6);
        this.firewood = this.add.image(player.x, player.y, "firewood_item5").setDepth(6);
        this.newspaper = this.add.image(player.x, player.y, "news").setDepth(6).setScale(.45);

        //wallet
        this.wallet = false;

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

        //game camera
        const camera = this.cameras.main;
        this.cameras.main.fadeIn(1000);
        camera.startFollow(player).setZoom(2);//adjust here to zoom camera in or out
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        //modified from https://github.com/nathanaltice/Mappy
        this.tutorial = map.createFromObjects("Dialog", {name: "tutorial"});
        this.tutorial3 = map.createFromObjects("Dialog", {name: "tutorial3"});
        this.movement_tutorial = map.createFromObjects("Dialog", {name: "movementinfo"});
        this.shop1_dialog = map.createFromObjects("Dialog", {name: "shop1visited"});
        this.shop2_dialog = map.createFromObjects("Dialog", {name: "shop2visited"});
        this.shop3_dialog = map.createFromObjects("Dialog", {name: "shop3visited"});
        this.shop4_dialog = map.createFromObjects("Dialog", {name: "shop4visited"});
        this.boss_dialog = map.createFromObjects("Dialog", {name: "bossvisited"});

        this.physics.world.enable(this.tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.tutorial3, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.movement_tutorial, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop1_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop2_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop3_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.shop4_dialog, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.boss_dialog, Phaser.Physics.Arcade.STATIC_BODY);

        if(tutorial1 == false) {
            this.overworld_dialog(this.tutorial, "Looks here like Feline Fragrances is right next door!");
            tutorial1 = true;
        } 
        if(tutorial2 == false) {
            this.overworld_dialog(this.movement_tutorial, "Arrow keys to move. Press [F] key to close dialog box.");
            tutorial2 = true;
        } 
        if(tutorial3 == false) {
            console.log(tutorial3);
            this.overworld_dialog(this.tutorial3, "Press [R] to open and close ITEM CHECKLIST. Press [Q] to check your WALLET");
            tutorial3 = true;
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
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        //spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
/*
        this.text = this.add.bitmapText(this.dialogbox.x - 275,  this.dialogbox.y, this.DBOX_FONT, `Don't come back until you got everything!`, this.TEXT_SIZE - 4);
        this.text.visible = false;
        this.text.setTint(0xe8c170);
*/
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
        //BOSS starting point
        if((player.x >= 450 && player.x <= 475) && player.y == 288){
        this.dialogbox.x = player.x;
        this.dialogbox.y = player.y + 100;
        }
        //BOSS starting point
        if((player.x >= 450 && player.x <= 475) && player.y == 304 && tutorial){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(endGame == true)
                this.scene.start('boss'); //prob make another SCENE
            //});
        } else if((player.x >= 450 && player.x <= 475) && player.y == 304){
            /*this.dialogbox.visible = true;
            this.text.visible = true;
            console.log('here', player.x, player.y);
            this.time.delayedCall(500, () => {
                console.log('uhoh');
                this.dialogbox.visible = false;
                this.text.visible = false;
            });
            
            //set max width for text so it doesnt go off dialogbox
            this.text.maxWidth = this.TEXT_MAX_WIDTH;*/
        }
        //shop4 brazenbazaar
        if((player.x >= 1750 && player.x <= 1775) && player.y == 240 && tutorial){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(shop4_visited == false)
                this.scene.start('shop4');
            //});
            /*
        } else if((player.x >= 867 && player.x <= 890) && player.y == 784){
            this.dialogbox.visible = true;
            this.text = this.add.bitmapText(this.dialogbox.x - 300,  this.dialogbox.y, this.DBOX_FONT, `Brazen Bazaar is closed! Come again soon~`, this.TEXT_SIZE - 4);
            this.text.setTint(0xe8c170);
            
            // set max width for text so it doesnt go off dialogbox
            this.text.maxWidth = this.TEXT_MAX_WIDTH;
            this.time.delayedCall(500, () => {
                this.dialogbox.visible = false;
                this.text.destroy();
            });
            */
        }
        //shop1
        if((player.x >= 1300 && player.x <= 1330) && player.y == 896 && tutorial){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {  
            if(shop1_visited == false)            
                this.scene.start('shop1');
            //});
        }
        //shop2 big dude
        //if((player.x >= 1748 && player.x <= 1772) && player.y == 192){ //with new tilemap
        if((player.x >= 867 && player.x <= 890) && player.y == 784 && tutorial){
            //player.anims.play('enterAnim');
            //player.on('animationcomplete', () => {
            if(shop2_visited == false)
                this.scene.start('shop2');
            //});
        }
        //shop3 cat
        //if((player.x >= 755 && player.x <= 780) && player.y == 288){ //with new tilemap
        if((player.x >= 755 && player.x <= 780) && player.y == 304 && !tutorial){
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

        this.item_checklist(player.x, player.y);

        //PLAYER MOVEMENT 
        if(this.dialogbox_Visible == true || this.item_checklist_Visible == true) {
            player.body.setVelocityX(0);
            player.body.setVelocityY(0);
            player.setTexture("player", "grenouille_walk_down-0")
            this.runningFX.stop();
        } else if(this.dialogbox_Visible == false) {
            
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
        if(Phaser.Input.Keyboard.JustDown(keyQ) && tutorial3 && !this.item_checklist_Visible){
            console.log(tutorial3);
            if(this.wallet){
                this.wallet_title_text.destroy();
                this.ui2_text.destroy();
                this.wallet = false;
            } else {
                this.wallet_title_text = this.add.bitmapText(player.x - 150, player.y + 100, this.DBOX_FONT, 'I still have ' + shillings + " shillings", 20).setDepth(6);
                this.ui2_text = this.add.bitmapText(player.x - 42, player.y + 145, this.DBOX_FONT, '[Q] to close', this.TEXT_SIZE).setScale(.5).setDepth(5).setTint(0xe8c170);
                this.wallet = true;
            }
        }
    
    }

    typeText(text) {
        this.dialogTyping = true;
        this.dialogbox_Visible = true;
        // clears text for the next dialog
        this.dialogText.text = '';
        this.nextText.text = '';

        this.dialogbox = this.add.sprite(player.x, player.y, 'dbox2').setOrigin(.5, 1.5).setScale(0.35).setDepth(4);
        this.dialogbox.visible = true;
        this.nextText.visible = true;
        this.dialogText.visible = true;
        this.dialogText.setPosition(this.dialogbox.x - 120, this.dialogbox.y -95);
        this.dialogText.setDepth(5);
        this.nextText.setPosition(player.x, player.y);
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
        overworld_dialog(obj, text) {
            this.physics.add.overlap(player, obj, (obj1, obj2) => {
                this.typeText(text);
                obj2.destroy();
            });
        }
        
        //checklist for game progression
        item_checklist(playerX, playerY) {
            if(this.item_checklist_Visible == false) {
                if(Phaser.Input.Keyboard.JustDown(keyR) && tutorial3 && !this.wallet) {
                    if (!this.checklist_open_SFX.isPlaying) {
                        this.checklist_open_SFX.play();
                    }
                    this.tweens.add({
                        targets: [this.overlay],
                        alpha: {from: 0, to: 1},
                        duration: 100,
                        ease: 'Sine.easeIn',
                        repeat: 0,
                        });

                    this.tweens.add({
                        targets: [this.jasmineOil, this.rosemaryOil, this.flask, this.firewood],
                        y: { value: playerY + 70, duration: 1500, ease: 'Bounce.easeOut' },
                        repeat: 0,
                        });

                    this.tweens.add({
                        targets: [this.cauldron],
                        y: { value: playerY + 60, duration: 1500, ease: 'Bounce.easeOut' },
                        repeat: 0,
                        });

                    this.overlay.visible = true;
                    this.cauldron.visible = true;
                    this.jasmineOil.visible = true;
                    this.rosemaryOil.visible = true;
                    this.flask.visible = true;
                    this.firewood.visible = true;
                    //this.newspaper.visible = true;

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
                    this.iventory_title_text = this.add.bitmapText(playerX - 195, playerY - 120, this.DBOX_FONT, 'CHECKLIST', this.TEXT_SIZE + 50).setDepth(6);
                    this.ui_text = this.add.bitmapText(playerX - 42, playerY + 145, this.DBOX_FONT, '[R] to close', this.TEXT_SIZE).setScale(.5).setDepth(5).setTint(0xe8c170);
                    this.cauldron_text = this.add.bitmapText(playerX - 228, playerY + 100, this.DBOX_FONT, 'CAULDRON', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.flask_text = this.add.bitmapText(playerX - 117, playerY + 100, this.DBOX_FONT, 'FLASK', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.jasmineOil_text = this.add.bitmapText(playerX - 35, playerY + 100, this.DBOX_FONT, 'JASMINE OIL', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.firewood_text = this.add.bitmapText(playerX + 75, playerY + 100, this.DBOX_FONT, 'FIREWOOD', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    this.rosemaryOil_text = this.add.bitmapText(playerX + 165, playerY + 100, this.DBOX_FONT, 'ROSEMARY OIL', this.TEXT_SIZE).setScale(.5).setDepth(5);
                    
                    //item start positioning for tween
                    this.overlay.setPosition(playerX, playerY);
                    this.cauldron.setPosition(playerX - 200, playerY - 75);
                    this.flask.setPosition(playerX - 100, playerY + 0);
                    this.jasmineOil.setPosition(playerX, playerY - 40);
                    this.firewood.setPosition(playerX + 100, playerY - 100);
                    this.rosemaryOil.setPosition(playerX + 200, playerY - 30);
                    this.newspaper.setPosition(playerX, playerY - 50);
                    this.item_checklist_Visible = true;
                }
            } else if (this.item_checklist_Visible == true) {
                if(Phaser.Input.Keyboard.JustDown(keyR) && tutorial3) {
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

                    this.overlay.visible = false;
                    this.cauldron.visible = false;
                    this.jasmineOil.visible = false;
                    this.rosemaryOil.visible = false;
                    this.flask.visible = false;
                    this.firewood.visible = false;
                    this.newspaper.visible = false;
                    this.item_checklist_Visible = false;
                }
            }
        }
        
}