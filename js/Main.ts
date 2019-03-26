namespace Main {
    
    export const WIDTH = 800;
    export const HEIGHT = 800;
    export const ON_SPIN = "onSpin";
        
    export class Main extends PIXI.Application {
        public theme: SlotTheme;
        public EventBus: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
        public animationBehavior: number = 0; //0 = complete stop, 1 = spin, 2 = stopping 
        public totalReelStopped: number = 3;
        public spinningFunc: Spinning;
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
        public updateReelStop() {
            this.totalReelStopped++;
            if (this.totalReelStopped == 3) {
                this.animationBehavior = 0;
                this.theme.enableButton();
                this.theme.checkWinning();
            }
        }
    }
    
    PIXI.loader.add("spritesJSON", "asset/img/sprites.json")
        .add("sprites", "asset/img/sprites.png");
    PIXI.loader.load();
    PIXI.loader.onComplete.add(() => {
        new Main();
    });
    export let SlotGame: Main;
}