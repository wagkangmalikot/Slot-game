namespace Main {

    export class symbols extends PIXI.Container {
        private symbol: PIXI.Sprite;
        constructor(currIndex) {
            super();
            this.symbol = this.addChild(PIXI.Sprite.fromFrame(currIndex + ".png"));// the image for the symbol
            this.symbol.anchor.set(.5);// the anchor of the  symbol
            this.symbol.position.set(this.symbol.width / 2, this.symbol.height / 2)// position of the symbol
        }

        public updateSymbol(currIndex) {
            this.symbol.texture = PIXI.Texture.fromFrame(currIndex + ".png");// update the image for the symbol
        }

        public animateSymbol() {// the animaton of the winning symbols
            this.symbol.alpha = 0;
            this.symbol.scale.set(.1, .1)
            TweenLite.to(this.symbol, 1, { alpha: 1 });
            TweenLite.to(this.symbol.scale, 1, { x: 1, y: 1 });
        }
        public reset() {// reset the properties of the winning symbols
            this.symbol.alpha = 1;
            this.symbol.scale.set(1, 1)
        }
    }
}