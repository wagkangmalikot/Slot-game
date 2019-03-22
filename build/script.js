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
(function (Main_1) {
    Main_1.WIDTH = 800;
    Main_1.HEIGHT = 800;
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main() {
            var _this = _super.call(this, {
                view: document.getElementById("game-canvas"),
                width: window.innerWidth,
                height: window.innerHeight,
                antialias: true,
                backgroundColor: 0x191919,
                forceCanvas: true
            }) || this;
            Main_1.SlotGame = _this;
            _this.theme = new Main_1.SlotTheme();
            _this.stage.addChild(_this.theme);
            return _this;
        }
        return Main;
    }(PIXI.Application));
    Main_1.Main = Main;
    PIXI.loader.add("spritesJSON", "asset/img/sprites.json")
        .add("sprites", "asset/img/sprites.png");
    PIXI.loader.load();
    PIXI.loader.onComplete.add(function () {
        new Main();
    });
})(Main || (Main = {}));
var Main;
(function (Main) {
    Main.ON_SPIN = "onSpin";
    var SlotTheme = (function (_super) {
        __extends(SlotTheme, _super);
        function SlotTheme() {
            var _this = _super.call(this) || this;
            _this.initialize();
            return _this;
        }
        SlotTheme.prototype.initialize = function () {
            var reelBG = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage("frameBackground.png"), 657, 570);
            reelBG.x = 33;
            reelBG.y = 31;
            this.addChild(reelBG);
            this.reelFrame = this.addChild(PIXI.Sprite.fromFrame("slotOverlay.png"));
            this.reelCol1 = this.addChild(new Main.SlotReel(0));
            this.reelCol1.x = 50;
            this.reelCol2 = this.addChild(new Main.SlotReel(1));
            this.reelCol2.x = 255;
            this.reelCol3 = this.addChild(new Main.SlotReel(2));
            this.reelCol3.x = 460;
            this.spinBtn = this.addChild(PIXI.Sprite.fromFrame("btn_spin_normal.png"));
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
            this.spinBtn.on("mousedown", function () { this.updateButtonState('pressed'); }, this)
                .on('mouseup', this.clickHandler, this)
                .on('mouseupoutside', function () { this.updateButtonState('normal'); }, this)
                .on('mouseover', function () { this.updateButtonState('hover'); }, this)
                .on('mouseout', function () { this.updateButtonState('normal'); }, this);
            this.spinBtn.position.set(700, 200);
        };
        SlotTheme.prototype.clickHandler = function () {
            this.spinBtn.interactive = this.spinBtn.buttonMode = false;
            this.updateButtonState('disabled');
        };
        SlotTheme.prototype.updateButtonState = function (state) {
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        };
        return SlotTheme;
    }(PIXI.Container));
    Main.SlotTheme = SlotTheme;
})(Main || (Main = {}));
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
            _this.symbolLists = Main.SYMBOL_LIST[reelNum];
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
        return SlotReel;
    }(PIXI.Container));
    Main.SlotReel = SlotReel;
})(Main || (Main = {}));
var Main;
(function (Main) {
    var symbols = (function (_super) {
        __extends(symbols, _super);
        function symbols(currIndex) {
            var _this = _super.call(this) || this;
            _this.symbol = _this.addChild(PIXI.Sprite.fromFrame(currIndex + ".png"));
            return _this;
        }
        symbols.prototype.updateSymbol = function (currIndex) {
            this.symbol.texture = PIXI.Texture.fromFrame(currIndex + ".png");
        };
        return symbols;
    }(PIXI.Container));
    Main.symbols = symbols;
})(Main || (Main = {}));
var Main;
(function (Main) {
    Main.SYMBOL_LIST = [
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    ];
    function random() {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }
    Main.random = random;
    function generateResult() {
        return [random(), random(), random()];
    }
    Main.generateResult = generateResult;
})(Main || (Main = {}));
