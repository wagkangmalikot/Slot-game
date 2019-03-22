namespace Main {
    export class SlotReel extends PIXI.Container {
        private reelContainer: PIXI.Container;
        private reelContainer2: PIXI.Container;
        private posYArr: Array<number> = [];
        private symbols_array: Array<symbols> = [];
        private symbols_array2: Array<symbols> = [];
        private symbolLists: Array<number> = [];
        private currIndex: number = 0;
        private reelNum: number;
        constructor(reelNum: number) {
            super();
            this.symbolLists = SYMBOL_LIST[reelNum];
            this.initialize();
        }

        public initialize() {
            var _mask = new PIXI.Graphics();
            this.addChild(_mask);
            _mask.beginFill(0x8bc5ff, 0.4);
            _mask.drawRect(-2, 35, 200, 560);
            this.mask = _mask;
            this.reelContainer = this.addChild(new PIXI.Container());
            this.reelContainer2 = this.addChild(new PIXI.Container());
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

    }
}