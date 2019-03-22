namespace Main {
    export const ON_SPIN = "onSpin";
    export class SlotTheme extends PIXI.Container {
        private reelBG: PIXI.Texture;
        private reelFrame: PIXI.Sprite;
        private reelCol1: SlotReel;
        private reelCol2: SlotReel;
        private reelCol3: SlotReel;
        private spinBtn: PIXI.Sprite;
        constructor() {
            super();
            this.initialize();

        }

        private initialize() {
            
            var reelBG = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage("frameBackground.png"), 657, 570);
            reelBG.x = 33;
            reelBG.y = 31;
            this.addChild(reelBG);
            this.reelFrame = this.addChild(PIXI.Sprite.fromFrame("slotOverlay.png"));
            this.reelCol1 = this.addChild(new SlotReel(0));
            this.reelCol1.x = 50;
            this.reelCol2 = this.addChild(new SlotReel(1));
            this.reelCol2.x = 255;
            this.reelCol3 = this.addChild(new SlotReel(2));
            this.reelCol3.x = 460;
            this.spinBtn = this.addChild(PIXI.Sprite.fromFrame("btn_spin_normal.png"));
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
            this.spinBtn.on("mousedown", function () { this.updateButtonState('pressed')} , this)
                .on('mouseup', this.clickHandler, this)
                .on('mouseupoutside', function () { this.updateButtonState('normal') }, this)
                .on('mouseover', function () { this.updateButtonState('hover') }, this)
                .on('mouseout', function () { this.updateButtonState('normal') }, this)
            this.spinBtn.position.set(700, 200)
        }
        public clickHandler() {
            this.spinBtn.interactive = this.spinBtn.buttonMode = false;
            this.updateButtonState('disabled');
        }
        public updateButtonState(state) {
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        }
    }
}