namespace Main {
    export class SlotTheme extends PIXI.Container {
        private reelBG: PIXI.Texture;
        private reelFrame: PIXI.Sprite;
        public reelCol1: SlotReel;
        private reelCol2: SlotReel;
        private reelCol3: SlotReel;
        private bonusGame: Bonus;
        public allWinningLine :Array<number[]> [] = [];
        private spinBtn: PIXI.Sprite;
        private winIndex: number = 0;
        private themeTimer;
        // private totalReelStopped: number = 3;
        private timer;
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
            this.spinBtn.position.set(700, 420);

            let __this = this;
            this.themeTimer = setTimeout(function(){
            
                __this.showBonus();
           }, 1000);
        }
        private clickHandler() {
            
            SlotGame.animationBehavior = 1;
            this.spinBtn.interactive = this.spinBtn.buttonMode = false;
            this.updateButtonState('disabled');
            SlotGame.spinningFunc.Spin()
            SlotGame.EventBus.emit(ON_SPIN)
            
            this.resetSymbols();
            

        }
        public resetSymbols(){
            this.winIndex = 0;
            for(let idx = 0; idx < this.reelCol1.symbols_array.length; idx++){
                this.reelCol1.symbols_array[idx].reset();
            }
            for(let idx = 0; idx < this.reelCol2.symbols_array.length; idx++){
                this.reelCol2.symbols_array[idx].reset();
            }
            for(let idx = 0; idx < this.reelCol3.symbols_array.length; idx++){
                this.reelCol3.symbols_array[idx].reset();
            }
            clearTimeout(this.themeTimer);
            this.themeTimer = null;
        }
        public checkWinning(){
            
            var resultArray:{}[] = []
            var checkIndex: number = 0;
            var wincount: number = 0;
            
            resultArray.push(this.reelCol1.result);
            resultArray.push(this.reelCol2.result);
            resultArray.push(this.reelCol3.result);
            Paylines.forEach(function (value) {
                for(let i = 0; i < 3; i++) {
                    for(let a = 0; a < 3; a++) {
                        if(checkIndex != 0){
                            if(value.payline[i][a] == 1 && resultArray[i][a] == checkIndex){
                                wincount++;
                                
                                if(wincount == 3){
                                    this.allWinningLine.push(value.payline)
                                }
                            }
                        }
                        else if(value.payline[i][a] == 1){
                            checkIndex = resultArray[i][a];
                            wincount++;
                        }
                    }
                }
                checkIndex = 0;
                wincount = 0;
            },this);
            this.animateWinning(this);

        }
        private animateWinning(__this: this){
            clearTimeout(this.themeTimer);
            this.themeTimer = null;
            if(__this.allWinningLine.length != __this.winIndex){
                 for(let i = 0; i < 3; i++) {
                    for(let a = 0; a < 3; a++) {
                        switch(i){
                            case 0:
                                if(this.allWinningLine[this.winIndex][i][a] == 1){
                                    this.reelCol1.animateSymbols(a);
                                }
                            break;
                            case 1:
                                if(this.allWinningLine[this.winIndex][i][a] == 1){
                                    this.reelCol2.animateSymbols(a);
                                }
                            break;
                            case 2:
                                if(this.allWinningLine[this.winIndex][i][a] == 1){
                                    this.reelCol3.animateSymbols(a);
                                }
                            break;
                        }
                    }
                } 
                this.winIndex++;
           }else{
                this.winIndex = 0;
           }
            this.themeTimer = setTimeout(function(){
                __this.animateWinning(__this);
           }, 1000);
        }
        public enableButton(){
            this.updateButtonState('normal');
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
        }
        public updateButtonState(state) {
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        }
        public showBonus(){
            this.spinBtn.interactive = this.spinBtn.buttonMode = false;
            this.updateButtonState('disabled');
            this.reelCol1.alpha = 0;
            this.reelCol2.alpha = 0;
            this.reelCol3.alpha = 0;
            this.bonusGame = this.addChild(new Bonus());
        }
        public endBonus(prize: number){
            this.removeChild(this.bonusGame);
            this.bonusGame = null;

            this.reelCol1.alpha = 1;
            this.reelCol2.alpha = 1;
            this.reelCol3.alpha = 1;

            
        }
       
        public update() {
            this.reelCol1.update();
            this.reelCol2.update();
            this.reelCol3.update();
        }
    }
}