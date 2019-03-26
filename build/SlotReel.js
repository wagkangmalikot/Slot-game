var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Main;
(function (Main) {
    var SlotReel = (function (_super) {
        __extends(SlotReel, _super);
        function SlotReel(reelNum) {
            var _this = _super.call(this) || this;
            _this.posYArr = [];
            _this.symbols_array = [];
            _this.symbols_array2 = [];
            _this.symbolLists = [];
            _this.currIndex = 0;
            _this.spinDone = false;
            _this.delay_ = 0;
            _this.result = [];
            _this.isStopping = false;
            _this.reelNum = reelNum;
            _this.delay_ = reelNum * 10;
            _this.symbolLists = Main.SYMBOL_LIST[reelNum];
            Main.SlotGame.EventBus.on(Main.SPIN_RESULT, _this.spinResult, _this);
            Main.SlotGame.EventBus.on(Main.ON_SPIN, function () { this.spinDone = false; }, _this);
            _this.initialize();
            return _this;
        }
        SlotReel.prototype.initialize = function () {
            var _mask = new PIXI.Graphics();
            this.addChild(_mask);
            _mask.beginFill(0x8bc5ff, 0.4);
            _mask.drawRect(-2, 35, 200, 560);
            this.mask = _mask;
            this.reelContainer = this.addChild(new PIXI.Container());
            this.reelContainer2 = this.addChild(new PIXI.Container());
            this.posYArr.push(this.reelContainer.y);
            for (var i = 0; i < 3; i++) {
                var symbol = this.reelContainer.addChild(new Main.symbols(this.symbolLists[this.currIndex]));
                this.symbols_array.push(symbol);
                symbol.y = 420 - ((symbol.height + 10) * i);
                this.currIndex++;
            }
            for (var i = 0; i < 3; i++) {
                var symbol = this.reelContainer2.addChild(new Main.symbols(this.symbolLists[this.currIndex]));
                this.symbols_array2.push(symbol);
                symbol.y = 420 - ((symbol.height + 10) * i);
                this.currIndex++;
            }
            this.reelContainer2.y = 0 - (this.reelContainer2.height + 10);
            this.posYArr.push(this.reelContainer2.y);
        };
        SlotReel.prototype.spinResult = function () {
            this.result = [];
            this.result = Main.SlotGame.spinningFunc.getResult(this.reelNum);
        };
        SlotReel.prototype.animateSymbols = function (_index) {
            if (_index === void 0) { _index = 0; }
            this.symbols_array[_index].animateSymbol();
        };
        SlotReel.prototype.resetSymbols = function (_index) {
            if (_index === void 0) { _index = 0; }
            this.symbols_array[_index].reset();
        };
        SlotReel.prototype.update = function () {
            var _this = this;
            if (Main.SlotGame.animationBehavior == 0 || this.spinDone) {
                this.reelContainer.y = this.posYArr[0];
                this.reelContainer2.y = this.posYArr[1];
                return;
            }
            if (this.delay_ > 0) {
                this.delay_--;
                return;
            }
            var speed = 35;
            this.reelContainer.y = this.reelContainer.y + speed;
            this.reelContainer2.y = this.reelContainer2.y + speed;
            if (this.reelContainer.y >= this.reelContainer.height) {
                this.reelContainer.y = this.reelContainer2.y - (this.reelContainer.height);
                if (Main.SlotGame.animationBehavior == 2) {
                    this.isStopping = true;
                    this.result.forEach(function (element, index) {
                        _this.symbols_array[index].updateSymbol(element);
                    });
                }
                else {
                    this.symbols_array.forEach(function (element) {
                        element.updateSymbol(_this.symbolLists[_this.currIndex]);
                        _this.currIndex = _this.currIndex < _this.symbolLists.length - 1 ? _this.currIndex + 1 : 0;
                    });
                }
            }
            if (this.reelContainer2.y >= this.reelContainer2.height) {
                this.reelContainer.y = 0;
                this.reelContainer2.y = this.reelContainer.y - (this.reelContainer2.height);
                this.symbols_array2.forEach(function (element) {
                    element.updateSymbol(_this.symbolLists[_this.currIndex]);
                    _this.currIndex = _this.currIndex < _this.symbolLists.length - 1 ? _this.currIndex + 1 : 0;
                });
                if (Main.SlotGame.animationBehavior == 2 && this.isStopping && this.reelNum == Main.SlotGame.totalReelStopped) {
                    Main.SlotGame.updateReelStop();
                    this.spinDone = true;
                    //this.currIndex = 0; //incase it is required to reset the symbols list on every spin
                    this.delay_ = this.reelNum * 10;
                    this.symbols_array2.forEach(function (element) {
                        element.updateSymbol(_this.symbolLists[_this.currIndex]);
                        _this.currIndex = _this.currIndex < _this.symbolLists.length - 1 ? _this.currIndex + 1 : 0;
                    });
                    this.isStopping = false;
                }
            }
        };
        return SlotReel;
    }(PIXI.Container));
    Main.SlotReel = SlotReel;
})(Main || (Main = {}));
