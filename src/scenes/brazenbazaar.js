class BrazenBazaar extends Phaser.Scene {
    constructor() {
        super('brazenBazaarScene');
    }

    preload() {
        // load assets
        this.load.path = './assets/images/';
        this.load.image('bg', 'temp_shopbg.png');
        this.load.spritesheet('shopkeep', 'shopkeep1t.png',{frameWidth: 225, frameHeight: 300, startFrame:0, endFrame: 18});
        this.load.image('player', 'icon.png');
        this.load.image('dbox', 'dialoguebox.png');
        this.load.image('star', 'star.png');
        this.load.image('shillings', 'shillings.png');
    }

    create() {
        // change bg color
        this.cameras.main.setBackgroundColor('#222');
        //add background
        this.background = this.add.image(game.config.width/2, game.config.height/2, 'bg');

        //add shopkeep
        this.keeper = this.add.sprite(game.config.width/2.5, game.config.height/4.75, 'shopkeep').setOrigin(0);
        this.anims.create({
            key: 'shopkeeper',
            frames:this.anims.generateFrameNumbers('shopkeep',{start: 0, end: 18, first: 0}),
            frameRate: 5
        });

        //add dialogue box
        this.dbox = this.add.image(game.config.width/2, game.config.height/2, 'dbox');
        //add player icon
        this.icon = this.add.image(game.config.width/5, game.config.height/1.2, 'player');

        // add temp
        this.temp = this.add.sprite(game.config.width/2, game.config.height/2, 'liquid');

        // create ooze states (as a JSON object)
        // solid | liquid | gas & accompanying transitions
        this.tempStates = [
			{
                'name': 'Start',
                'text': 'Hello dear customer! How may I help you today?',
                'initial': 	true,
				'events': {
                    'Good morning! I would like to buy some marjoram from you today, do you have any in stock?': 'positive1',
                    'Hey, I’m in a rush. Ya think I could grab some marjoram from you?':'negative1'
				}
			},
            {
                'name': 'positive1',
                'text' : 'Oh of course my dear! I would be glad to assist you, that would be 1 shilling.',
                'events': {
                    'Great, thank you ma’am!' : 'exit',
                    'What a ripoff!' : 'negative2',
                    'I’m sorry maam, it seems like I don’t have enough. Do you think you could lower the price?':'positive2'
                }
            },
            {
                'name' : 'negative2',
                'text' : 'Well, have I never! If you are so upset feel free to shop elsewhere. \nYou are officially banned from this establishment! Get out of my shop!',
                'events': {
                    'I should leave' : 'exit'
                }
            },
            {
                'name': 'banned',
                'text' : 'Guess that did not go too well...',
                'events': {
                    'leave' : 'exit'
                }
            },
            {
                'name': 'exit',
                'text' : '',
                'events': {}
            },
            {
                'name': 'positive2',
                'text' : ' Poor sweet child! Is there a reason why you are unable to afford such pleasures?',
                'events' : {
                    'Because you’re a scammer, that’s why!' : 'negative2',
                    'My allowance is only so little and my chore list is so long. If you could spare some change for me, that would be great.' : 'positive3'
                }
            },
            {
                'name': 'positive3',
                'text' : 'Well, you seem like an honest person… I guess I shall allow it for 6 pence this time. \nBut be sure not to spend your money all in one place! Money is hard to come by.',
                'events' : {
                    'Thank you maam!':'exit'
                }
            },
            {
                'name': 'negative1',
                'text': 'Well dear me! If you’re in a rush, I can bag this up for you for 1 shilling and 6 pence.',
                'events' : {
                    'Excuse me? The price was 1 shilling in today’s newspaper!' : 'negative3',
                    'I’m sorry maam, it seems like I don’t have enough. Do you think you could lower the price?' : 'positive4'
                }
            },
            {
                'name': 'negative3',
                'text': 'Well, the price has just gone up to a shilling and 6 pence. \nIf you have an issue with that, you may shop elsewhere.',
                'events': {
                    'Fine, here you go':'exit',
                    'I refuse, I will head elsewhere thank you very much!': 'exit'
                }
            },
            {
                'name': 'positive4',
                'text' : 'Well? What is wrong child? Spit it out!',
                'events' : {
                    'You’re a scammer, that’s what is wrong!' : 'negative2',
                    'My allowance is only so little and my chore list is so long. If you could spare some change for me, that would be great.' : 'positive5'
                }
            },
            {
                'name': 'positive5',
                'text' : 'I guess I shall allow it for 1 shilling this time. \nBut you better learn some manners next time you come around.',
                'events' : {
                    'Thank you maam!':'exit'
                }
            },
        ];

        // define transition time (ms)
        this.transitionTime = 750; 

        // create state machine on ooze object, passing JSON states object & target object
        this.temp.tempFSM = new StateMachine(this.tempStates, this.temp);

        // initialize our transitioning flag
        this.transitioning = false;

        // display info text
        this.statusText = this.add.text(game.config.width/2, game.config.height/7, `${this.temp.tempFSM.getState().text}`, { font: '30px Futura', fill: '#FFFFFF' }).setOrigin(0.5);
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
    update(){
        //play animation
        this.keeper.anims.play('shopkeeper', true);
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
        if(this.temp.tempFSM.currentState.name == 'exit'){
            this.scene.start('menu');
        }
        this.temp.setTexture(this.temp.tempFSM.currentState.image);
        let options = Object.keys(this.temp.tempFSM.currentState.events).map((k,i) => `(${i+1}) ${k}\n`);
        this.transitionText.text = `${options.join(' ')}`;
        this.statusText.text = `${this.temp.tempFSM.currentState.text}`;
    }
}