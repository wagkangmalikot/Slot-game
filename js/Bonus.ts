 namespace Main {
        export class Bonus extends PIXI.Container {
            private item1: PIXI.Sprite;
            private item2: PIXI.Sprite;
            private item3: PIXI.Sprite;
            public bonusWin: number;
        constructor() {
            super();
            this.initialize();
        }
        public initialize() {
            let __this = this;
            let text = this.addChild(new PIXI.Text('Choose 1 to win Free spin',{fontFamily : 'Arial', fontSize: 40, fill : 0xff1010, align : 'center'}));
            text.anchor.set(.5);
            text.position.set(360, 220);
            text.scale.set(.1, .1);
            text.alpha = 0;

            this.item1 = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            this.item1.anchor.set(.5);
            this.item1.position.set(170, 400);
            this.item1.scale.set(.1, .1);
            this.item1.alpha = 0;
            this.item1.name = 'item1';
            this.item1.on('click', this.clickHandler, this)
            this.item2 = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            this.item2.anchor.set(.5);
            this.item2.position.set(370, 400);
            this.item2.scale.set(.1, .1);
            this.item2.alpha = 0;
            this.item2.name = 'item2';
            this.item2.on('click', this.clickHandler, this)
            this.item3 = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            this.item3.anchor.set(.5);
            this.item3.position.set(570, 400);
            this.item3.scale.set(.1, .1);
            this.item3.alpha = 0;
            this.item3.name = 'item3';
            this.item3.on('click', this.clickHandler, this)

            TweenLite.to(text, .5, { delay:.25, alpha: 1 });
            TweenLite.to(text.scale, .5, { delay:.25, x: 1, y: 1 });

            TweenLite.to(this.item1, .5, { delay: 1, alpha: 1 });
            TweenLite.to(this.item2, .5, { delay: 1.5, alpha: 1 });
            TweenLite.to(this.item3, .5, { delay: 2, alpha: 1 });
            TweenLite.to(this.item1.scale, .5, { delay: 1, x: 1, y: 1 });
            TweenLite.to(this.item2.scale, .5, { delay: 1.5, x: 1, y: 1 });
            TweenLite.to(this.item3.scale, .5, { delay: 2, x: 1, y: 1, onComplete:function(){
                __this.item1.buttonMode = __this.item1.interactive = true;
                __this.item2.buttonMode = __this.item2.interactive = true;
                __this.item3.buttonMode = __this.item3.interactive = true;
            }});
        }
        private clickHandler(e) {
            this.item1.interactive = this.item1.buttonMode = false;
            this.item2.interactive = this.item2.buttonMode = false;
            this.item3.interactive = this.item3.buttonMode = false;

            this.bonusWin = Math.floor(Math.random() * (10 - 1 + 1)) + 2;
            let text = this.addChild(new PIXI.Text( this.bonusWin.toString() + '\nFREE\nSPINS',{fontFamily : 'Arial', fontSize: 30, fill : 0xff1010, align : 'center'}));
            text.anchor.set(.5);
            text.position.set(e.currentTarget.x, e.currentTarget.y);

            this.exitBonus();
        }
        private exitBonus(){
            TweenLite.to(this, .5, { delay: 1, alpha: 0, onComplete: SlotGame.theme.endBonus(this.bonusWin)});
        }
    }
}