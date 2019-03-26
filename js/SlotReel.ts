


    namespace Main {
        export class SlotReel extends PIXI.Container {
        public reelContainer: PIXI.Container;
        private reelContainer2: PIXI.Container;
        private posYArr: Array<number> = [];
        public symbols_array: Array<symbols> = [];
        private symbols_array2: Array<symbols> = [];
        private symbolLists: Array<number> = [];
        private currIndex: number = 0;
        private reelNum: number;
        private spinDone: boolean = false;
        private delay_: number = 0;
        public result: Array<number> = [];
        private isStopping: boolean = false;
        constructor(reelNum: number) {
            super();
            this.reelNum = reelNum;
            this.delay_ = reelNum * 10;
            this.symbolLists = SYMBOL_LIST[reelNum];
            SlotGame.EventBus.on(SPIN_RESULT, this.spinResult, this)
            SlotGame.EventBus.on(ON_SPIN, function () { this.spinDone = false }, this)
            this.initialize();
        }

        public initialize() {
            var _mask = new PIXI.Graphics();// mask for the reel
            this.addChild(_mask);
            _mask.beginFill(0x8bc5ff, 0.4);
            _mask.drawRect(-2, 35, 200, 560);
            this.mask = _mask;
            this.reelContainer = this.addChild(new PIXI.Container());// the result container
            this.reelContainer2 = this.addChild(new PIXI.Container());// the filler container for the spin animation
            this.posYArr.push(this.reelContainer.y)
            for (let i = 0; i < 3; i++) {
                let symbol: symbols = this.reelContainer.addChild(new symbols(this.symbolLists[this.currIndex]));
                this.symbols_array.push(symbol);
                symbol.y = 420 - ((symbol.height + 10) * i);
                this.currIndex++;
            }
            for (let i = 0; i < 3; i++) {
                let symbol: symbols = this.reelContainer2.addChild(new symbols(this.symbolLists[this.currIndex]));
                this.symbols_array2.push(symbol);
                symbol.y = 420 - ((symbol.height + 10) * i);
                this.currIndex++;
            }

            this.reelContainer2.y = 0 - (this.reelContainer2.height + 10);
            this.posYArr.push(this.reelContainer2.y)
        }
        public spinResult() {
            this.result = [];// reset the result array in every spin
            this.result = SlotGame.spinningFunc.getResult(this.reelNum);// push the result symbols in result array
        }
        public animateSymbols(_index: number = 0){
            this.symbols_array[_index].animateSymbol();// will call the animation of symbols
        }
        public resetSymbols(_index: number = 0){
            this.symbols_array[_index].reset();// reset the properties of the symbols
        }
        public update() { // in here handle the spinning animation
            if (SlotGame.spinningStatus == 0 || this.spinDone) {
                this.reelContainer.y = this.posYArr[0];
                this.reelContainer2.y = this.posYArr[1];
                return;
            }
            if (this.delay_ > 0) {
                this.delay_--;
                return;
            }
            let speed: number = 35;
            this.reelContainer.y = this.reelContainer.y + speed;
            this.reelContainer2.y = this.reelContainer2.y + speed;
            if (this.reelContainer.y >= this.reelContainer.height) {
                this.reelContainer.y = this.reelContainer2.y - (this.reelContainer.height);
                if (SlotGame.spinningStatus == 2) {
                    this.isStopping = true;
                    this.result.forEach((element, index) => {
                        this.symbols_array[index].updateSymbol(element);
                    });
                } else {
                    this.symbols_array.forEach(element => {
                        element.updateSymbol(this.symbolLists[this.currIndex]);
                        this.currIndex = this.currIndex < this.symbolLists.length - 1 ? this.currIndex + 1 : 0;
                    });
                }
            }
            if (this.reelContainer2.y >= this.reelContainer2.height) {
                this.reelContainer.y = 0;

                this.reelContainer2.y = this.reelContainer.y - (this.reelContainer2.height);

                this.symbols_array2.forEach(element => {
                    element.updateSymbol(this.symbolLists[this.currIndex]);
                    this.currIndex = this.currIndex < this.symbolLists.length - 1 ? this.currIndex + 1 : 0;
                });
                if (SlotGame.spinningStatus == 2 && this.isStopping && this.reelNum == SlotGame.totalReelStopped) {
                    SlotGame.updateReelStop();
                    this.spinDone = true;
                    this.delay_ = this.reelNum * 10;
                    this.symbols_array2.forEach(element => {
                        element.updateSymbol(this.symbolLists[this.currIndex]);
                        this.currIndex = this.currIndex < this.symbolLists.length - 1 ? this.currIndex + 1 : 0;
                    });
                    this.isStopping = false;
                }
            }
            
        }
    }
}