namespace Main {
    
    export const WIDTH = 800; // width of slot
    export const HEIGHT = 800;// height of slot
    export const ON_SPIN = "onSpin";//variable to track if the reel is spinning
        
    export class Main extends PIXI.Application {
        public theme: SlotTheme;// class handle the theme of the slot
        public EventBus: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
        public spinningStatus: number = 0; //0 = complete stop, 1 = spin, 2 = stopping 
        public totalReelStopped: number = 3;// to track how many reel stop
        public spinningFunc: Spinning;// class handle the spinning of the reel
        constructor() {
            super({
                view: document.getElementById("game-canvas") as HTMLCanvasElement,
                width: window.innerWidth,
                height: window.innerHeight,
                antialias: true,
                backgroundColor: 0x191919,
                forceCanvas: true
            });

            SlotGame = this;
            this.theme = new SlotTheme();
            this.stage.addChild(this.theme);
            this.ticker.add(this.update, this);
            this.spinningFunc = new Spinning();
        }
        private update(elapsed: number) {
            this.theme.update();
        }
        public updateReelStop() { //this will be call everytime the reel stop.
            this.totalReelStopped++;
            if (this.totalReelStopped == 3) {
                this.spinningStatus = 0;
                this.theme.enableButton(); //enable the spin button
                this.theme.checkWinning();// this will check if there are winnings in reel stop
            }
        }
    }
    
    PIXI.loader.add("spritesJSON", "asset/img/sprites.json") // load images and json
        .add("sprites", "asset/img/sprites.png");
    PIXI.loader.load();
    PIXI.loader.onComplete.add(() => {
        new Main();
    });
    export let SlotGame: Main;
}