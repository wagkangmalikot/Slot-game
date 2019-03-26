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
    var SlotTheme = (function (_super) {
        __extends(SlotTheme, _super);
        function SlotTheme() {
            var _this = _super.call(this) || this;
            _this.allWinningLine = [];
            _this.winIndex = 0;
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
            this.spinBtn.position.set(700, 420);
            var __this = this;
            this.themeTimer = setTimeout(function () {
                __this.showBonus();
            }, 1000);
        };
        SlotTheme.prototype.clickHandler = function () {
            Main.SlotGame.animationBehavior = 1;
            this.spinBtn.interactive = this.spinBtn.buttonMode = false;
            this.updateButtonState('disabled');
            Main.SlotGame.spinningFunc.Spin();
            Main.SlotGame.EventBus.emit(Main.ON_SPIN);
            this.resetSymbols();
        };
        SlotTheme.prototype.resetSymbols = function () {
            this.winIndex = 0;
            for (var idx = 0; idx < this.reelCol1.symbols_array.length; idx++) {
                this.reelCol1.symbols_array[idx].reset();
            }
            for (var idx = 0; idx < this.reelCol2.symbols_array.length; idx++) {
                this.reelCol2.symbols_array[idx].reset();
            }
            for (var idx = 0; idx < this.reelCol3.symbols_array.length; idx++) {
                this.reelCol3.symbols_array[idx].reset();
            }
            clearTimeout(this.themeTimer);
            this.themeTimer = null;
        };
        SlotTheme.prototype.checkWinning = function () {
            var resultArray = [];
            var checkIndex = 0;
            var wincount = 0;
            resultArray.push(this.reelCol1.result);
            resultArray.push(this.reelCol2.result);
            resultArray.push(this.reelCol3.result);
            Main.Paylines.forEach(function (value) {
                for (var i = 0; i < 3; i++) {
                    for (var a = 0; a < 3; a++) {
                        if (checkIndex != 0) {
                            if (value.payline[i][a] == 1 && resultArray[i][a] == checkIndex) {
                                wincount++;
                                if (wincount == 3) {
                                    this.allWinningLine.push(value.payline);
                                }
                            }
                        }
                        else if (value.payline[i][a] == 1) {
                            checkIndex = resultArray[i][a];
                            wincount++;
                        }
                    }
                }
                checkIndex = 0;
                wincount = 0;
            }, this);
            this.animateWinning(this);
        };
        SlotTheme.prototype.animateWinning = function (__this) {
            clearTimeout(this.themeTimer);
            this.themeTimer = null;
            if (__this.allWinningLine.length != __this.winIndex) {
                for (var i = 0; i < 3; i++) {
                    for (var a = 0; a < 3; a++) {
                        switch (i) {
                            case 0:
                                if (this.allWinningLine[this.winIndex][i][a] == 1) {
                                    this.reelCol1.animateSymbols(a);
                                }
                                break;
                            case 1:
                                if (this.allWinningLine[this.winIndex][i][a] == 1) {
                                    this.reelCol2.animateSymbols(a);
                                }
                                break;
                            case 2:
                                if (this.allWinningLine[this.winIndex][i][a] == 1) {
                                    this.reelCol3.animateSymbols(a);
                                }
                                break;
                        }
                    }
                }
                this.winIndex++;
            }
            else {
                this.winIndex = 0;
            }
            this.themeTimer = setTimeout(function () {
                __this.animateWinning(__this);
            }, 1000);
        };
        SlotTheme.prototype.enableButton = function () {
            this.updateButtonState('normal');
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
        };
        SlotTheme.prototype.updateButtonState = function (state) {
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        };
        SlotTheme.prototype.showBonus = function () {
            this.reelCol1.alpha = 0;
            this.reelCol2.alpha = 0;
            this.reelCol3.alpha = 0;
            this.bonusGame = this.addChild(new Main.Bonus());
        };
        SlotTheme.prototype.update = function () {
            this.reelCol1.update();
            this.reelCol2.update();
            this.reelCol3.update();
        };
        return SlotTheme;
    }(PIXI.Container));
    Main.SlotTheme = SlotTheme;
})(Main || (Main = {}));
