class Ooze extends Phaser.Scene {
    constructor() {
        super('oozeScene');
    }

    preload() {
        // load assets
        this.load.path = './assets/';
        this.load.image('solid', 'solid.png');
        this.load.image('liquid', 'liquid.png');
        this.load.image('gas', 'gas.png');
        this.load.image('yoshi', 'dino.png');
        this.load.image('egg', 'yegg.png');
        this.load.image('shregg', 'shregg.png');
        this.load.image('star', 'star.png');
        this.load.image('shillings', 'shillings.png');
    }

    create() {
        // change bg color
        this.cameras.main.setBackgroundColor('#222');

        // add liquid ooze
        this.ooze = this.add.sprite(game.config.width/2, game.config.height/2, 'liquid');

        // create ooze states (as a JSON object)
        // solid | liquid | gas & accompanying transitions
        this.oozeStates = [
			{
                'name': 'Start',
                'text': 'Ho peat, i’m running base on prfume ingredients. \nI needeth thee to runneth out and receiveth me some by the endeth of the day r else you’re fird.  \nHre’s 2 shillings.  Anon hie befre i starteth to loseth some customrs!',
                'image' : 'shillings',
                'initial': 	true,
				'events': {
                    'But boss, 2 shillings is mrely 24 pence!\n how couldst thee possibly expecteth me to purchaseth aught with this?': 'Well thee bettr figure t out, r else you’re fired! anon receiveth to t'
				}
			},
            {
                'name': 'Well thee bettr figure t out, r else you’re fired! anon receiveth to t',
                'text' : 'Well thee bettr figure t out, r else you’re fired! anon receiveth to t',
                'events': {
                    'exit shop' : 'exit opening scene'
                }
            },
            {
                'name' : 'exit opening scene',
                'text' : 'The boss gaveth me a listeth of ingredients, let’s taketh a behold',
                'events': {
                    'close ingredient list' : 'Close ingredients'
                }
            },
            {
                'name': 'Close ingredients',
                'text' : 'Good now, well i guesseth i shouldst taketh a behold at the newspapr\n and seeth what all the stres hast on sale the present day',
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
                'text' : 'Alloweths wend to “brazen bazaar” first, \nthe mistress thre is at each moment nice, \nhaply i can receiveth a valorous dealeth out of hr!',
                'events' : {
                    'move on map' : 'move to Brazen Bazaar'
                }
            },
            {
                'name': 'move to Brazen Bazaar',
                'text' : 'Holla lief customr! how may i holp thee the present day?',
                'events' : {
                    'Valorous mrning! i wouldst liketh to buyeth some marjram from thee the present day, \ndoth thee hast any in stock?' : 'positive1',
                    'Ho, i’m in a sweaty haste.  \nYa bethink i couldst grabeth some marjram from thee?' : 'negative1'
                }
            },
            {
                'name': 'positive1',
                'text' : 'Oh of course mine own lief! \ni wouldst beest fain to assisteth thee, yond wouldst beest 1 shilling',
                'events' : {
                    'Most wondrous, thanketh thee ma’am!' : 'gain marjoram',
                    'What a ripoff!' : 'negative2',
                    'I’m srry maam, t seemeth liketh i don’t hast enow. \nDoth thee bethink thee couldst baser the price?' : 'haggle'
                }
            },
            {
                'name': 'gain marjoram',
                'text' : 'Pleasure doing business with thee leman. \nHast a wondrful day',
                'events' : {
                    'Exit the shop' : 'exit'
                }
            },
            {
                'name' : 'negative1',
                'text' : 'Well lief me! if t be true you’re in a sweaty haste, \ni can container this up fr thee fr 15 dollars',
                'events' : {
                    'Colours me? the price wast 1 shilling in today’s newspapr!' : 'negative11',
                    'I’m srry maam, t seemeth liketh i don’t hast enow. \nDoth thee bethink thee couldst baser the price?' : 'haggle'
                }
            }
        ];

        // define transition time (ms)
        this.transitionTime = 750; 

        // create state machine on ooze object, passing JSON states object & target object
        this.ooze.oozeFSM = new StateMachine(this.oozeStates, this.ooze);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        this.statusText = this.add.text(game.config.width/2, game.config.height/6, `${this.ooze.oozeFSM.getState().text}`, { font: '15px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
        this.transitionText = this.add.text(game.config.width/2, game.config.height/6*5, ``, { font: '15px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
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
        let availableEvents = Object.keys(this.ooze.oozeFSM.currentState.events);
        
        // we only have a few of them
        if(index >= availableEvents.length) {
            return;
        }
        let selectedEvent = availableEvents[index];
        
        // set a timer while we transition
        this.transitioning = true;
        this.transitionText.text = `Enacting: ${selectedEvent}...`;
        this.time.delayedCall(this.transitionTime, () => {
            this.transitioning = false;
            this.ooze.oozeFSM.consumeEvent(selectedEvent);
            this.syncDisplayInfo();
        });

        // wooze them in the meantime
        this.tweens.add({
            targets: [this.throbber1, this.throbber2],
            alpha: {from: 0, to: 1},
            duration: this.transitionTime,
            ease: 'Sine.easeInOut',
            yoyo: true
        })
    }

    syncDisplayInfo() {
        this.ooze.setTexture(this.ooze.oozeFSM.currentState.image);
        let options = Object.keys(this.ooze.oozeFSM.currentState.events).map((k,i) => `(${i+1}) ${k}\n`);
        this.transitionText.text = `${options.join(' ')}`;
        this.statusText.text = `${this.ooze.oozeFSM.currentState.text}`;
    }
}