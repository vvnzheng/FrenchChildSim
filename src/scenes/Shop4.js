class Shop4 extends Phaser.Scene {
    constructor() {
        super("shop4");
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
        //audio
        this.game.sound.stopAll();
        this.NPC_soundtrack = this.sound.add('npcMusic', {loop: true, volume: .2});
        this.itemAquiredSFX = this.sound.add('itemAquiredSFX', {loop: false, volume: .3})
        this.NPC_soundtrack.play();

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

        this.shopkeeper4 = this.add.sprite(game.config.width/2.5, 96,'shopkeep4').setOrigin(0).setScale(3);
        this.anims.create({
            key: 'shopkeep4',
            frames:this.anims.generateFrameNumbers('shopkeep4',{start: 0, end: 19, first: 0}),
            frameRate: 10,
            loop: -1
        });

        this.prop = this.add.sprite(game.config.width/2, game.config.height/2, 'propsetup');
        this.prop2 = this.add.sprite(game.config.width/2, game.config.height/3, 'propsetup');

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

        //init json file
        this.dialog = this.cache.json.get('shopkeep4_dialog');
     
        this.textDisplay();
    }

    update() {
        //animations
        this.shopbg.anims.play('shopbg', true);
        this.shopkeeper4.play('shopkeep4', true);
        this.player_icon.play('icon_idle', true);

        //this.player_icon.play('icon_talk', true);

        // hide response until dialog is finished
        if(!this.dialogTyping ) {
            this.transitionText.visible = true;
        } else {
            this.transitionText.visible = false;
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
                scale: {from: 4.9, to: 5},
                duration: 500,
                yoyo: true,
                ease: 'Sine.easeInOut',
                repeat: -1,
                });
        }
    }

    syncDisplayInfo() {
        console.log(this.prop.tempFSM.currentState.name);
        if(this.prop.tempFSM.currentState.name == 'exit'){
            lastShopVisited = 'SHOP4';
            shop4_visited = true;
            numOfShopsVisited -= 1;
            this.cameras.main.fadeOut(cameraFadeTime);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.time.delayedCall(500, () => {
                this.scene.start('overworldScene');
                })
            })
        } else if (this.prop.tempFSM.currentState.name == 'PURCHASE JASMINE OIL'){
            //this.cauldron.visible = false;
            jasmineOilBought += 1;
        }  
        this.soundFX();
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
        if(`${this.prop.tempFSM.getState().cName}` == 'undefined') {
            this.dialogbox.visible = false;
            this.player_icon.visible = false;
            text = ' ';
        } else {
            this.dialogbox.visible = true;
            this.player_icon.visible = true;
            text = this.prop.tempFSM.currentState.cName + ': ' + this.prop.tempFSM.currentState.text; //new
            //text = `${this.prop.tempFSM.getState().cName}` + ': ' + `${this.prop.tempFSM.getState().text}`; //old
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
    
    //plays sound when acquiring item
    soundFX() {
        if(this.prop.tempFSM.currentState.sound == true) {
            if(!this.itemAquiredSFX.play()){
                this.itemAquiredSFX.play();
            }
        }
        else {
            this.itemAquiredSFX.stop();
        }
    }
}