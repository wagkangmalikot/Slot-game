namespace Main {
    export class SlotTheme extends PIXI.Container {
        private reelBG: PIXI.Texture;
        private reelFrame: PIXI.Sprite;
        public reelCol1: SlotReel;
        private reelCol2: SlotReel;
        private reelCol3: SlotReel;
        private bonusGame: Bonus;
        private freeSpinFeat: Freespin;
        public allWinningLine: { payline: Array<number[]> , symbol:number}[] = [];
        private spinBtn: PIXI.Sprite;
        private winIndex: number = 0;
        private themeTimer;
        private fsCount: number = 0;
        private toFreeSpin: boolean = false;
        private cheatCount: number = 0;
        constructor() {
            super();
            this.initialize();
        }

        private initialize() {
            var reelBG = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage("frameBackground.png"), 657, 570); //add the reel BG
            reelBG.x = 33;
            reelBG.y = 31;
            this.addChild(reelBG);
            this.reelFrame = this.addChild(PIXI.Sprite.fromFrame("slotOverlay.png")); // add the reel frame
            this.reelCol1 = this.addChild(new SlotReel(0)); // add 3 reel column
            this.reelCol1.x = 50;
            this.reelCol2 = this.addChild(new SlotReel(1));
            this.reelCol2.x = 255;
            this.reelCol3 = this.addChild(new SlotReel(2));
            this.reelCol3.x = 460;
            this.spinBtn = this.addChild(PIXI.Sprite.fromFrame("btn_spin_normal.png")); // add spin button
            this.enableButton();
            this.spinBtn.on("mousedown", function () { this.updateButtonState('pressed')} , this) // spin button event handler
                .on('mouseup', this.clickHandler, this)
                .on('mouseupoutside', function () { this.updateButtonState('normal') }, this)
                .on('mouseover', function () { this.updateButtonState('hover') }, this)
                .on('mouseout', function () { this.updateButtonState('normal') }, this)
            this.spinBtn.position.set(700, 420);
        }
        public clickHandler() {  // when the spin has been clicked
            SlotGame.spinningStatus = 1; //variable that track if the reel is spinning
            this.disableButton(); // disable the spin button
            switch(this.cheatCount){ // this is only to test the feature of the game
                case 1: 
                SlotGame.spinningFunc.Spin('winning')// this will make you win by force
                break;
                case 3:
                SlotGame.spinningFunc.Spin('bonus')// this will make you win bonus game by force
                break;
                default:
                SlotGame.spinningFunc.Spin('normal');// this is the default result. The result here is random.
                break;
            }
            

            SlotGame.EventBus.emit(ON_SPIN)// event listerer that track the spinning event
            
            this.resetSymbols();
            
            if(this.toFreeSpin && this.fsCount >0){// if in Freespin feature. this will track the free spin and update the free spin in the game 
                this.fsCount--;
                this.freeSpinFeat.updateFS(this.fsCount);
            }else{
                if(this.toFreeSpin){// if currently in free spin feature and there are no more free spin, this will call the free spin game to exit 
                    this.cheatCount = 0;// this is only to test the feature of the game
                    this.freeSpinFeat.exit();
                    this.toFreeSpin = false;// to track if the game is on free spin feature
                }
            }
            if(this.fsCount == 0){// if currently in free spin feature and there are no more free spin, this will call the free spin game to exit 
                this.cheatCount +=1;
            }
        }
        public resetSymbols(){// this will reset the symbols properties
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
            // this will try to detect if there are winnings on spipn stop;
            var resultArray:{}[] = []
            var checkIndex: number = 0;
            var wincount: number = 0;
            
            this.allWinningLine=[];
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
                                    if( resultArray[i][a] == 10){// 10 is the symbol for Bonus. If you have won bonus game, this will disable the spin button
                                        this.disableButton();
                                    }
                                    this.allWinningLine.push([value.payline, resultArray[i][a]]);// allWinningLine handle all the winning symbols in every spin
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
        private animateWinning(__this: this){// this will call the animations of the winning symbols if there are winning.
            clearTimeout(this.themeTimer);
            this.themeTimer = null;
            if(__this.allWinningLine.length != __this.winIndex){
                 for(let i = 0; i < 3; i++) {
                    for(let a = 0; a < 3; a++) {
                        switch(i){
                            case 0:
                                if(this.allWinningLine[this.winIndex][0][i][a] == 1){
                                    this.reelCol1.animateSymbols(a);
                                }
                            break;
                            case 1:
                                if(this.allWinningLine[this.winIndex][0][i][a] == 1){
                                    this.reelCol2.animateSymbols(a);
                                }
                            break;
                            case 2:
                                if(this.allWinningLine[this.winIndex][0][i][a] == 1){
                                    this.reelCol3.animateSymbols(a);
                                }
                            break;
                        }
                    }
                } 
                if(this.allWinningLine[this.winIndex][1] == 10){// call bonus game if you won the bonus
                    this.themeTimer = setTimeout(function(){
                        __this.showBonus();
                        clearTimeout(__this.themeTimer);
                        __this.themeTimer = null;
                        
                   }, 1000);
                   this.winIndex++;
                   return;
                }
                /* if(this.allWinningLine[this.winIndex][1] == 10){
                    this.themeTimer = setTimeout(function(){
                        __this.fsCount += 3;
                        if(__this.freeSpinFeat == null || __this.freeSpinFeat == undefined){
                            __this.showFreespin();
                        }else{
                            __this.freeSpinFeat.updateFS(__this.fsCount);
                            __this.clickHandler();
                        }
                        clearTimeout(__this.themeTimer);
                        __this.themeTimer = null;
                        
                   }, 1000);
                   this.winIndex++;
                   return;
                } */
                
                this.winIndex++;
                
           }else{
                this.winIndex = 0;
                if(this.toFreeSpin && this.fsCount > 0){
                    this.themeTimer = setTimeout(function(){
                        __this.clickHandler();
                   }, 1000);
                   
                }
                else if(this.toFreeSpin && this.fsCount == 0){
                    this.cheatCount = 0;
                    this.toFreeSpin = false;
                    this.freeSpinFeat.exit();
                }
                return;
           }
            this.themeTimer = setTimeout(function(){
                __this.animateWinning(__this);
           }, 1000);
        }
        public enableButton(){// enable the spin button
            this.updateButtonState('normal');
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
        }
        public disableButton(){// disable the spin button
            this.updateButtonState('disabled');
            this.spinBtn.buttonMode = this.spinBtn.interactive = false;
        }
        public updateButtonState(state) {// update the spin button state
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        }
        public showBonus(){// this will handle what will happen if the bonus game has been won
            this.disableButton();
            this.reelCol1.alpha = 0;
            this.reelCol2.alpha = 0;
            this.reelCol3.alpha = 0;
            this.bonusGame = this.addChild(new Bonus());
        }
        public endBonus(prize: number){// call after the bonus game
            this.fsCount = prize;
            this.removeChild(this.bonusGame);
            this.bonusGame = null;

            this.reelCol1.alpha = 1;
            this.reelCol2.alpha = 1;
            this.reelCol3.alpha = 1;

            this.showFreespin();// after the bonus game, free spin will be triggered
        }
        private showFreespin(){// this will handle what will happen if the free spin game has been triggered
            this.toFreeSpin = true;
            this.freeSpinFeat = this.addChild(new Freespin(this.fsCount));
        }
        public endFreespin(){//call after the free spin game end
            this.removeChild(this.freeSpinFeat);
            this.freeSpinFeat = null;
        }
        public update() {
            this.reelCol1.update();
            this.reelCol2.update();
            this.reelCol3.update();
        }
    }
}