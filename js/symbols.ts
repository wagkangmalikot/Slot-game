namespace Main {

    export class symbols extends PIXI.Container {
        private symbol: PIXI.Sprite;
        constructor(currIndex) {
            super();
            this.symbol = this.addChild(PIXI.Sprite.fromFrame(currIndex + ".png"));
        }

        public updateSymbol(currIndex) {
            this.symbol.texture = PIXI.Texture.fromFrame(currIndex + ".png");
        }

    }
}