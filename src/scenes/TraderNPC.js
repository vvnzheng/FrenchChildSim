class TraderNPC extends Phaser.Scene {
    constructor() {
        super("traderNPC");

        // dialog constants
        this.DBOX_X = game.config.width/5.3;			    // dialog box x-position
        this.DBOX_Y = 502;			    // dialog box y-position
        this.DBOX_FONT = 'font';	// dialog box font key

        this.TEXT_X = game.config.width/4.5;			// text w/in dialog box x-position
        this.TEXT_Y = 547;			// text w/in dialog box y-position
        this.TEXT_SIZE = 24;		// text font size (in pixels)
        this.TEXT_MAX_WIDTH = 715;	// max width of text within box

        this.NEXT_TEXT = '[SPACE]';	// text to display for next prompt
        this.NEXT_X = 1000;			// next text prompt x-position
        this.NEXT_Y = 690;			// next text prompt y-position
        this.INTERACT_EXIT = '';

        this.LETTER_TIMER = 10;		// # ms each letter takes to "type" onscreen

        // dialog variables
        this.dialogConvo = 0;			// current "conversation"
        this.dialogLine = 0;			// current line of conversation
        this.dialogSpeaker = null;		// current speaker
        this.dialogLastSpeaker = null;	// last speaker
        this.dialogTyping = false;		// flag to lock player input while text is "typing"
        this.dialogText = null;			// the actual dialog text
        this.nextText = null;			// player prompt text to continue typing
        this.dialogOver = false;
        this.exitText = null;
        this.choice = 0;

        // character variables
        this.icon = null;
        this.minerva = null;
        this.neptune = null;
        this.jove = null;
        this.tweenDuration = 500;

        this.OFFSCREEN_X = -500;        // x,y values to place characters offscreen
        this.OFFSCREEN_Y = 1000;
    }

    create() {
        this.game.sound.stopAll();
        // parse dialog from JSON file
        this.dialog = this.cache.json.get('traderNPC_dialog');
        //console.log(this.dialog);
        this.NPC_soundtrack = this.sound.add('npcMusic', {loop: true, volume: .2});
        this.NPC_soundtrack.play();

        this.cameras.main.fadeIn(2000);
        this.cameras.main.setBackgroundColor(0x222034);

        //animations and sprite load
        this.shopbg = this.add.sprite(game.config.width/8, 0,'shopbg').setOrigin(0).setScale(1.2);
        this.anims.create({
            key: 'shopbg',
            frames:this.anims.generateFrameNumbers('shopbg',{start: 0, end: 4, first: 0}),
            frameRate: 10,
            loop: -1
        })

        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dbox2').setOrigin(0);

        //this.NPC_trader = this.add.sprite(game.config.width/2.1, game.config.height/2.9,'shopkeep1').setOrigin(0).setScale(1.2);
        this.NPC_trader = this.add.sprite(game.config.width/2.5, 104,'shopkeep1').setOrigin(0).setScale(4);
        this.anims.create({
            key: 'shopkeep1',
            frames:this.anims.generateFrameNumbers('shopkeep1',{start: 0, end: 18, first: 0}),
            frameRate: 10,
            loop: -1
        })

        this.dialogFX = this.sound.add('dialogFX',{loop: true, volume: .3});

        // add dialog box sprite
        //this.dialogbox = this.add.sprite(0, 0, 'dbox').setOrigin(0);


        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE);

        // ready the character dialog images offscreen
        /*
        this.icon = this.add.image(this.OFFSCREEN_X+500, this.DBOX_Y+8, 'player_icon').setOrigin(0, 1);
        this.minerva = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'minerva').setOrigin(0, 1);
        this.neptune = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'neptune').setOrigin(0, 1);
        this.jove = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'jove').setOrigin(0, 1);
*/
        // input
        cursors = this.input.keyboard.createCursorKeys();

        // start dialog
        this.typeText();  
        
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);   
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);      
    }

    update() {
        // check for spacebar press
        if(Phaser.Input.Keyboard.JustDown(cursors.space) && !this.dialogTyping) {
            // trigger dialog
            this.typeText();
        }

        if(this.dialogOver == true) {
            this.exitText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '[F] TO EXIT', this.TEXT_SIZE).setOrigin(1);
            if(Phaser.Input.Keyboard.JustDown(keyF))
                this.scene.start('overworldScene');
        }

        if(Phaser.Input.Keyboard.JustDown(keyQ)) {
            this.choice = 1;
        } else if(Phaser.Input.Keyboard.JustDown(keyW)) {
            this.choice = 2;
        }

        console.log(this.choice);



        //animations
        this.shopbg.anims.play('shopbg', true);
        this.NPC_trader.play('shopkeep1', true);
    }

    typeText() {
        // lock input while typing
        this.dialogTyping = true;

        // clear text
        this.dialogText.text = '';
        this.nextText.text = '';

        /* Note: In my conversation data structure: 
                - each array within the main JSON array is a "conversation"
                - each object within a "conversation" is a "line"
                - each "line" can have 3 properties: 
                    1. a speaker (required)
                    2. the dialog text (required)
                    3. an (optional) flag indicating if this speaker is new
        */

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
            this.dialogLine = 0;
            // I increment conversations here, but you could create logic to exit the dialog here
            this.dialogConvo++;
        }
        
        // make sure we haven't run out of conversations...
        if(this.dialogConvo >= this.dialog.length) {
            // here I'm simply "exiting" the last speaker and removing the dialog box,
            // but you could build other logic to change game states here
            console.log('End of Conversations');
            this.dialogOver = true;
            // tween out prior speaker's image
            /*
            if(this.dialogLastSpeaker) {
                this.tweens.add({
                    targets: this[this.dialogLastSpeaker],
                    x: this.OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });
            }
            // make text box invisible
            */
            //this.dialogbox.visible = false;

        } else {
            // if not, set current speaker
            this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker'];
            // check if there's a new speaker (for exit/enter animations)
            if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
                // tween out prior speaker's image
                /*
                if(this.dialogLastSpeaker) {
                    this.tweens.add({
                        targets: this[this.dialogLastSpeaker],
                        x: this.OFFSCREEN_X,
                        duration: this.tweenDuration,
                        ease: 'Linear'
                    });
                }
                // tween in new speaker's image
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.DBOX_X + 50,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                });*/
            }

            // build dialog (concatenate speaker + line of text)
            this.dialogLines = this.dialog[this.dialogConvo][this.dialogLine]['speaker'].toUpperCase() + ': ' + this.dialog[this.dialogConvo][this.dialogLine]['dialog'];

            // create a timer to iterate through each letter in the dialog text
            let currentChar = 0; 
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.dialogLines.length - 1,
                callback: () => { 
                    // concatenate next letter from dialogLines
                    this.dialogText.text += this.dialogLines[currentChar];
                    // advance character position
                    currentChar++;
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1);
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

            // increment dialog line
            this.dialogLine++;

            // set past speaker
            this.dialogLastSpeaker = this.dialogSpeaker;

            if(this.dialogTyping == true){
                if (!this.dialogFX.isPlaying) this.dialogFX.play();
            } /*else {
                if(this.dialogTyping === false) this.dialogFX.pause();
            }*/
        }
    }
}