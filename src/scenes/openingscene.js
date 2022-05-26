class OpeningScene extends Phaser.Scene {
    constructor() {
        super('openingScene');
    }

    create() {
        this.NPC_soundtrack = this.sound.add('npcMusic', {loop: true, volume: .5});
        this.NPC_soundtrack.play();

        // change bg color
        this.cameras.main.setBackgroundColor('#222');
        //add boss
        this.bossman = this.add.sprite(game.config.width/2.5, game.config.height/4.75, 'shopkeep').setOrigin(0);
        this.anims.create({
            key: 'owner',
            frames:this.anims.generateFrameNumbers('boss',{start: 0, end: 11, first: 0}),
            frameRate: 10
        });
        //add dialogue box
        this.dbox = this.add.image(game.config.width/2, game.config.height/2, 'dbox');
        //add player icon
        this.icon = this.add.image(game.config.width/5, game.config.height/1.2, 'player_icon');

        // add temp
        this.temp = this.add.sprite(game.config.width/2, game.config.height/2, 'liquid');

        // create ooze states (as a JSON object)
        // solid | liquid | gas & accompanying transitions
        this.tempStates = [
			{
                'name': 'Start',
                'text': 'Hey kid, I’m running low on perfume ingredients. \nI need you to run out and get me some by the end of the day. \nHere’s 2 shillings. Now hurry before I start to lose some customers!',
                'image' : 'shillings',
                'initial': 	true,
				'events': {
                    'But boss, 2 shillings is merely 24 pence! \nHow could you possibly expect me to purchase anything with this?': 'Well you better figure it out, or else you’re fired! Now get to it.'
				}
			},
            {
                'name': 'Well you better figure it out, or else you’re fired! Now get to it.',
                'text' : 'Well you better figure it out, or else you’re fired! Now get to it.',
                'events': {
                    'exit shop' : 'exit opening scene'
                }
            },
            {
                'name' : 'exit opening scene',
                'text' : 'The boss gave me a list of ingredients, let’s take a look.',
                'events': {
                    'close ingredient list' : 'Close ingredients'
                }
            },
            {
                'name': 'Close ingredients',
                'text' : 'Alright, well I guess I should take a look at the newspaper and see what all the stores have on sale today.',
                'events': {
                    'open newspaper' : 'Open newspaper'
                }
            },
            {
                'name': 'Open newspaper',
                'text' : '',
                'events': {
                    'close newspaper' : 'Close newspaper'
                }
            },
            {
                'name': 'Close newspaper',
                'text' : 'Alright, well I guess I should take a look at the newspaper and see what all the stores have on sale today.',
                'events' : {
                    'move on map' : 'move to Brazen Bazaar'
                }
            },
            {
                'name': 'move to Brazen Bazaar',
                'text' : '',
                'events' : {}
            }
        ];

        // define transition time (ms)
        this.transitionTime = 750; 

        // create state machine on ooze object, passing JSON states object & target object
        this.temp.tempFSM = new StateMachine(this.tempStates, this.temp);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        this.statusText = this.add.text(game.config.width/2, game.config.height/7, `${this.temp.tempFSM.getState().text}`, { font: '30px Futura', fill: '#FFFFFF', align: 'left' }).setOrigin(0.5);
        this.transitionText = this.add.text(game.config.width/2, game.config.height/6*5, ``, { font: '15px Futura', fill: '#FFFFFF', align: 'left' }).setOrigin(0.5);
        this.syncDisplayInfo();
        
        // throbber objects will obscure the asset swap during transitions
        this.throbber1 = this.add.ellipse(game.config.width/2, game.config.height/2, game.config.width/4,game.config.width/6, 0xAAFF88);
        this.throbber2 = this.add.ellipse(game.config.width/2, game.config.height/2, game.config.width/6,game.config.width/4, 0x88FFAA);
        this.throbber1.alpha = 0;
        this.throbber2.alpha = 0;
        
        // pulse slowly
        this.tweens.add({
            targets: [this.throbber1],
            scale: {from: 1.1, to: 0.9},
            duration: 500,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1,
        });

        // pulse slightly slowlier
        this.tweens.add({
            targets: [this.throbber2],
            scale: {from: 1.1, to: 0.9},
            duration: 432,
            yoyo: true,
            ease: 'Sine.easeInOut',
            repeat: -1,
        });

        // ask for keydown events as they happen
        this.input.keyboard.on('keydown', this.keydown, this);
    }
    update(){
        //play animation
        this.bossman.anims.play('owner', true);
    }

    keydown(event) {

        // ignore non-numeric keys
        if(isNaN(event.key)) {
            return;
        }

        // ignore keydown during transitions
        if(this.transitioning) {
            return;
        }

        // which event are they trying to enact?
        let index = Number.parseInt(event.key) - 1; // start at 1
        let availableEvents = Object.keys(this.temp.tempFSM.currentState.events);
        
        // we only have a few of them
        if(index >= availableEvents.length) {
            return;
        }
        let selectedEvent = availableEvents[index];
        
        // set a timer while we transition
        this.transitioning = true;
            this.transitioning = false;
            this.temp.tempFSM.consumeEvent(selectedEvent);
            this.syncDisplayInfo();
    }

    syncDisplayInfo() {
        console.log(this.temp.tempFSM.currentState.name);
        if(this.temp.tempFSM.currentState.name == 'move to Brazen Bazaar'){
            this.scene.start('overworldScene');
        }
        this.temp.setTexture(this.temp.tempFSM.currentState.image);
        let options = Object.keys(this.temp.tempFSM.currentState.events).map((k,i) => `(${i+1}) ${k}\n`);
        this.transitionText.text = `${options.join(' ')}`;
        this.statusText.text = `${this.temp.tempFSM.currentState.text}`;
    }
}