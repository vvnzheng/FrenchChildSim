class Boss extends Phaser.Scene {
    constructor() {
        super("boss");
        this.DBOX_X = 169;	        // dialog box x-position
        this.DBOX_Y = 460;
        this.TEXT_X = 380;	        // text w/in dialog box x-position
        this.TEXT_Y = 490;	        // text w/in dialog box y-position
        this.DBOX_FONT = 'font';
        this.TEXT_SIZE = 20;
        this.TEXT_MAX_WIDTH = 700;
        //delete maybe
        this.NEXT_TEXT = '[SPACE]';	// text to display for next prompt
        this.NEXT_X = 1000;			// next text prompt x-position
        this.NEXT_Y = 650;			// next text prompt y-position

        // dialog variables
        this.dialogConvo = 0;			// current "conversation"
        this.dialogTyping = false;		// flag to lock player input while text is "typing"
        this.dialogText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing
        this.choice = 0;
    }

    create() {
        this.game.sound.stopAll();

        cursors = this.input.keyboard.createCursorKeys();

        this.cameras.main.fadeIn(cameraFadeTime);
        this.cameras.main.setBackgroundColor(0x222034);

        //animations and sprite load
        this.shopbg = this.add.sprite(game.config.width/8, 0,'shopbg').setOrigin(0).setScale(1.2).setFlip(true);
        this.anims.create({
            key: 'shopbg',
            frames:this.anims.generateFrameNumbers('shopbg',{start: 0, end: 4, first: 0}),
            frameRate: 10,
            loop: -1
        });

        this.boss = this.add.sprite(game.config.width/2.5, 97,'boss').setOrigin(0).setScale(1.2);
        this.anims.create({
            key: 'boss',
            frames:this.anims.generateFrameNumbers('boss',{start: 0, end: 11, first: 0}),
            frameRate: 10,
            loop: -1
        });

        this.prop = this.add.sprite(game.config.width/2, game.config.height/2, 'propsetup');
        this.prop2 = this.add.sprite(game.config.width/2, game.config.height/3, 'propsetup').setDepth(1);

        //dbox
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dbox2').setOrigin(0).setScale(1.2);

        //player icon and anims
        this.player_icon = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'icon_idle').setOrigin(-0.3,-0.5).setScale(1.2);
        this.anims.create({
            key: 'icon_idle',
            frames:this.anims.generateFrameNumbers('icon_idle',{start: 0, end: 11, first: 0}),
            frameRate: 5,
            loop: 1
        });
        this.anims.create({
            key: 'icon_talk',
            frames:this.anims.generateFrameNumbers('icon_talk',{start: 0, end: 11, first: 0}),
            frameRate: 7,
            loop: -1
        });

        this.dialogFX = this.sound.add('dialogFX',{loop: true, volume: .3});

        //init text
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);

        //item checklist
        this.item_checklist_Visible = false;
        this.cauldron = this.add.image(0, 0, "cauldron_item1").setDepth(1);
        this.jasmineOil = this.add.image(0, 0, "jasmineOil_item2").setDepth(1).setScale(2);
        this.rosemaryOil = this.add.image(0, 0, "rosemaryOil_item3").setDepth(1).setScale(2);
        this.flask = this.add.image(0, 0, "flask2_item4").setDepth(1).setScale(2);
        this.firewood = this.add.image(0, 0, "firewood_item5").setDepth(1).setScale(2);

        this.cauldron.visible = false;
        this.jasmineOil.visible = false;
        this.rosemaryOil.visible = false;
        this.flask.visible = false;
        this.firewood.visible = false;

        //tutorial
        this.tutorial_visible = false;
        this.tutorial_box = this.add.sprite(380, 400, 'dbox2').setScale(.5);
        this.tutorial_box.visible = false;
        this.tutorial_text = this.add.bitmapText(200, 393, this.DBOX_FONT, `Press [1], [2], [3] to select dialog`, this.TEXT_SIZE - 4).setTint(0xe8c170);
        this.tutorial_text.visible = false;

        //init json file
        this.dialog = this.cache.json.get('boss_dialog');
     
        this.textDisplay();
    }

    update() {
        //animations
        this.shopbg.anims.play('shopbg', true);
        this.boss.play('boss', true);
        this.player_icon.play('icon_idle', true);

        //this.player_icon.play('icon_talk', true);

        // hide response until dialog is finished
        if(!this.dialogTyping ) {
            this.transitionText.visible = true;
        } else {
            this.transitionText.visible = false;
        }

        if(this.prop.tempFSM.getState().name == 'Start') {
            this.tutorial_dialog();
        } else if (this.prop.tempFSM.getState().name == '3') {
            this.tutorial_box.visible = false;
            this.tutorial_text.visible = false;
        }

        if(this.prop.tempFSM.getState().name == 'exit opening scene') {
            this.item_checklist(game.config.width/2, game.config.height/3);
        } else if(this.prop.tempFSM.getState().name == 'Close ingredients'){
            this.cauldron_text.destroy();
            this.jasmineOil_text.destroy();
            this.rosemaryOil_text.destroy();
            this.flask_text.destroy();
            this.firewood_text.destroy();
            this.iventory_title_text.destroy(); 

            this.cauldron.visible = false;
            this.jasmineOil.visible = false;
            this.rosemaryOil.visible = false;
            this.flask.visible = false;
            this.firewood.visible = false;
            this.item_checklist_Visible = false;
        }
    }

    textDisplay() {
        // create state machine on ooze object, passing JSON states object & target object
        this.prop.tempFSM = new StateMachine(this.dialog);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        //this.statusText = this.add.bitmapText(this.TEXT_X-100, this.TEXT_Y-100, this.DBOX_FONT,`${this.temp.tempFSM.getState().text}`,this.TEXT_SIZE);
        this.transitionText = this.add.bitmapText(this.TEXT_X,  this.TEXT_Y + 110, this.DBOX_FONT, ``, this.TEXT_SIZE - 4);
        this.transitionText.setTint(0xe8c170);

        this.syncDisplayInfo();
        
        // set max width for text so it doesnt go off dialogbox
        this.transitionText.maxWidth = this.TEXT_MAX_WIDTH;

        // ask for keydown events as they happen
        this.input.keyboard.on('keydown', this.keydown, this);
    }

    keydown(event) {

        if(!this.dialogTyping){
            // ignore non-numeric keys
            if(isNaN(event.key)) {
                return;
            }

            if(Phaser.Input.Keyboard.JustDown(cursors.space)) {
                return;
            }

            // which event are they trying to enact?
            let index = Number.parseInt(event.key) - 1; // start at 1
            let availableEvents = Object.keys(this.prop.tempFSM.currentState.events);
            
            // we only have a few of them
            if(index >= availableEvents.length) {
                return;
            }
            let selectedEvent = availableEvents[index];
            
            // set a timer while we transition
            this.transitioning = true;
            this.prop.tempFSM.consumeEvent(selectedEvent);
            
            this.syncDisplayInfo();
            //response tween
            this.tweens.add({
                targets: [this.transitionText],
                scale: {from: 1.2, to: 1},
                duration: 750,
                yoyo: false,
                ease: 'Sine.easeOut',
                repeat: 0,
            });
            this.tweens.add({
                targets: [this.prop2],
                scale: {from: 1.2, to: 1},
                duration: 750,
                yoyo: false,
                ease: 'Sine.easeOut',
                repeat: 0,
            });
        }
    }

    syncDisplayInfo() {
        console.log(this.prop.tempFSM.currentState.name);
        if(this.prop.tempFSM.currentState.name == 'exit'){
            this.sound.play('door_closeSFX',{loop:false, volume: 1});
            lastShopVisited = 'BOSS';
            this.cameras.main.fadeOut(cameraFadeTime);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.time.delayedCall(500, () => {
                this.scene.start('overworldScene');
                })
            })   
        }
        this.prop.setTexture(this.prop.tempFSM.currentState.image);
        this.prop2.setTexture(this.prop.tempFSM.currentState.image2);
        let options = Object.keys(this.prop.tempFSM.currentState.events).map((k,i) => `(${i+1}) ${k}\n`); //`(${i+1}) ${k}\n`);
        this.typeText(this.transitionText.text = `${options.join('')}`);
    }

    //typewriter effect taken from https://github.com/nathanaltice/Dialogging
    typeText(text) {
        this.dialogTyping = true;

        // clears text for the next dialog
        this.dialogText.text = '';
        this.nextText.text = '';
        
        // build dialog (concatenate speaker + line of text)
        //text = this.dialog[this.dialogConvo]['cName'].toUpperCase() + ': ' + `${this.prop.tempFSM.getState().text}`;
        if(`${this.prop.tempFSM.getState().cName}` == 'undefined') {
            this.dialogbox.visible = false;
            this.player_icon.visible = false;
            text = ' ';
        } else {
        text = `${this.prop.tempFSM.getState().cName}` + ': ' + `${this.prop.tempFSM.getState().text}`;
        }

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
                    // show prompt for more text
                    //this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
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

    item_checklist(playerX, playerY) {
        if(this.item_checklist_Visible == false) {
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

            this.cauldron.visible = true;
            this.jasmineOil.visible = true;
            this.rosemaryOil.visible = true;
            this.flask.visible = true;
            this.firewood.visible = true;
            
            //item start positioning for tween
            this.cauldron.setPosition(playerX - 325, playerY - 75);
            this.flask.setPosition(playerX - 150, playerY + 0);
            this.jasmineOil.setPosition(playerX, playerY - 40);
            this.firewood.setPosition(playerX + 175, playerY - 100);
            this.rosemaryOil.setPosition(playerX + 350, playerY - 30);

            //text
            this.iventory_title_text = this.add.bitmapText(playerX - 195, playerY - 120, this.DBOX_FONT, 'CHECKLIST', this.TEXT_SIZE + 50).setDepth(6);
            this.cauldron_text = this.add.bitmapText(playerX - 375, playerY + 150, this.DBOX_FONT, 'CAULDRON', this.TEXT_SIZE).setDepth(5);
            this.flask_text = this.add.bitmapText(playerX - 185, playerY + 150, this.DBOX_FONT, 'FLASK', this.TEXT_SIZE).setDepth(5);
            this.jasmineOil_text = this.add.bitmapText(playerX - 65, playerY + 150, this.DBOX_FONT, 'JASMINE OIL', this.TEXT_SIZE).setDepth(5);
            this.firewood_text = this.add.bitmapText(playerX + 125, playerY + 150, this.DBOX_FONT, 'FIREWOOD', this.TEXT_SIZE).setDepth(5);
            this.rosemaryOil_text = this.add.bitmapText(playerX + 280, playerY + 150, this.DBOX_FONT, 'ROSEMARY OIL', this.TEXT_SIZE).setDepth(5);

            this.item_checklist_Visible = true;
        }
    }

    tutorial_dialog() {
        if(this.tutorial_visible == false) {
            this.tutorial_box.visible = true;
            this.tutorial_text.visible = true;
        }
    }
}