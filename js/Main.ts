namespace Main {
    export const WIDTH = 800;
    export const HEIGHT = 800;
    export class Main extends PIXI.Application {
        private theme: SlotTheme;
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
            this.stage.addChild(this.theme)
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