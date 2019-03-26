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
    Main_1.ON_SPIN = "onSpin";
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
            _this.EventBus = new PIXI.utils.EventEmitter();
            _this.spinningStatus = 0;
            _this.totalReelStopped = 3;
            Main_1.SlotGame = _this;
            _this.theme = new Main_1.SlotTheme();
            _this.stage.addChild(_this.theme);
            _this.ticker.add(_this.update, _this);
            _this.spinningFunc = new Main_1.Spinning();
            return _this;
        }
        Main.prototype.update = function (elapsed) {
            this.theme.update();
        };
        Main.prototype.updateReelStop = function () {
            this.totalReelStopped++;
            if (this.totalReelStopped == 3) {
                this.spinningStatus = 0;
                this.theme.enableButton();
                this.theme.checkWinning();
            }
        };
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
    var SlotTheme = (function (_super) {
        __extends(SlotTheme, _super);
        function SlotTheme() {
            var _this = _super.call(this) || this;
            _this.allWinningLine = [];
            _this.winIndex = 0;
            _this.fsCount = 0;
            _this.toFreeSpin = false;
            _this.cheatCount = 0;
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
            this.enableButton();
            this.spinBtn.on("mousedown", function () { this.updateButtonState('pressed'); }, this)
                .on('mouseup', this.clickHandler, this)
                .on('mouseupoutside', function () { this.updateButtonState('normal'); }, this)
                .on('mouseover', function () { this.updateButtonState('hover'); }, this)
                .on('mouseout', function () { this.updateButtonState('normal'); }, this);
            this.spinBtn.position.set(700, 420);
        };
        SlotTheme.prototype.clickHandler = function () {
            Main.SlotGame.spinningStatus = 1;
            this.disableButton();
            switch (this.cheatCount) {
                case 1:
                    Main.SlotGame.spinningFunc.Spin('winning');
                    break;
                case 3:
                    Main.SlotGame.spinningFunc.Spin('bonus');
                    break;
                default:
                    Main.SlotGame.spinningFunc.Spin('normal');
                    break;
            }
            Main.SlotGame.EventBus.emit(Main.ON_SPIN);
            this.resetSymbols();
            if (this.toFreeSpin && this.fsCount > 0) {
                this.fsCount--;
                this.freeSpinFeat.updateFS(this.fsCount);
            }
            else {
                if (this.toFreeSpin) {
                    this.cheatCount = 0;
                    this.freeSpinFeat.exit();
                    this.toFreeSpin = false;
                }
            }
            if (this.fsCount == 0) {
                this.cheatCount += 1;
            }
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
            this.allWinningLine = [];
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
                                    if (resultArray[i][a] == 10) {
                                        this.disableButton();
                                    }
                                    this.allWinningLine.push([value.payline, resultArray[i][a]]);
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
                                if (this.allWinningLine[this.winIndex][0][i][a] == 1) {
                                    this.reelCol1.animateSymbols(a);
                                }
                                break;
                            case 1:
                                if (this.allWinningLine[this.winIndex][0][i][a] == 1) {
                                    this.reelCol2.animateSymbols(a);
                                }
                                break;
                            case 2:
                                if (this.allWinningLine[this.winIndex][0][i][a] == 1) {
                                    this.reelCol3.animateSymbols(a);
                                }
                                break;
                        }
                    }
                }
                if (this.allWinningLine[this.winIndex][1] == 10) {
                    this.themeTimer = setTimeout(function () {
                        __this.showBonus();
                        clearTimeout(__this.themeTimer);
                        __this.themeTimer = null;
                    }, 1000);
                    this.winIndex++;
                    return;
                }
                this.winIndex++;
            }
            else {
                this.winIndex = 0;
                if (this.toFreeSpin && this.fsCount > 0) {
                    this.themeTimer = setTimeout(function () {
                        __this.clickHandler();
                    }, 1000);
                }
                else if (this.toFreeSpin && this.fsCount == 0) {
                    this.cheatCount = 0;
                    this.toFreeSpin = false;
                    this.freeSpinFeat.exit();
                }
                return;
            }
            this.themeTimer = setTimeout(function () {
                __this.animateWinning(__this);
            }, 1000);
        };
        SlotTheme.prototype.enableButton = function () {
            this.updateButtonState('normal');
            this.spinBtn.buttonMode = this.spinBtn.interactive = true;
        };
        SlotTheme.prototype.disableButton = function () {
            this.updateButtonState('disabled');
            this.spinBtn.buttonMode = this.spinBtn.interactive = false;
        };
        SlotTheme.prototype.updateButtonState = function (state) {
            this.spinBtn.texture = PIXI.Texture.fromFrame("btn_spin_" + state + ".png");
        };
        SlotTheme.prototype.showBonus = function () {
            this.disableButton();
            this.reelCol1.alpha = 0;
            this.reelCol2.alpha = 0;
            this.reelCol3.alpha = 0;
            this.bonusGame = this.addChild(new Main.Bonus());
        };
        SlotTheme.prototype.endBonus = function (prize) {
            this.fsCount = prize;
            this.removeChild(this.bonusGame);
            this.bonusGame = null;
            this.reelCol1.alpha = 1;
            this.reelCol2.alpha = 1;
            this.reelCol3.alpha = 1;
            this.showFreespin();
        };
        SlotTheme.prototype.showFreespin = function () {
            this.toFreeSpin = true;
            this.freeSpinFeat = this.addChild(new Main.Freespin(this.fsCount));
        };
        SlotTheme.prototype.endFreespin = function () {
            this.removeChild(this.freeSpinFeat);
            this.freeSpinFeat = null;
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
            if (Main.SlotGame.spinningStatus == 0 || this.spinDone) {
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
                if (Main.SlotGame.spinningStatus == 2) {
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
                if (Main.SlotGame.spinningStatus == 2 && this.isStopping && this.reelNum == Main.SlotGame.totalReelStopped) {
                    Main.SlotGame.updateReelStop();
                    this.spinDone = true;
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
var Main;
(function (Main) {
    var symbols = (function (_super) {
        __extends(symbols, _super);
        function symbols(currIndex) {
            var _this = _super.call(this) || this;
            _this.symbol = _this.addChild(PIXI.Sprite.fromFrame(currIndex + ".png"));
            _this.symbol.anchor.set(.5);
            _this.symbol.position.set(_this.symbol.width / 2, _this.symbol.height / 2);
            return _this;
        }
        symbols.prototype.updateSymbol = function (currIndex) {
            this.symbol.texture = PIXI.Texture.fromFrame(currIndex + ".png");
        };
        symbols.prototype.animateSymbol = function () {
            this.symbol.alpha = 0;
            this.symbol.scale.set(.1, .1);
            TweenLite.to(this.symbol, 1, { alpha: 1 });
            TweenLite.to(this.symbol.scale, 1, { x: 1, y: 1 });
        };
        symbols.prototype.reset = function () {
            this.symbol.alpha = 1;
            this.symbol.scale.set(1, 1);
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
    Main.Paylines = [
        { "payline": [[0, 1, 0], [0, 1, 0], [0, 1, 0]], "index": 1 },
        { "payline": [[1, 1, 1], [0, 0, 0], [0, 0, 0]], "index": 2 },
        { "payline": [[0, 0, 1], [0, 1, 0], [1, 0, 0]], "index": 3 },
        { "payline": [[0, 0, 1], [0, 0, 1], [0, 0, 1]], "index": 4 },
        { "payline": [[0, 0, 0], [1, 1, 1], [0, 0, 0]], "index": 5 },
        { "payline": [[1, 0, 0], [0, 1, 0], [0, 0, 1]], "index": 6 },
        { "payline": [[1, 0, 0], [1, 0, 0], [1, 0, 0]], "index": 7 },
        { "payline": [[0, 0, 0], [0, 0, 0], [1, 1, 1]], "index": 8 },
    ];
    function random() {
        return Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    }
    Main.random = random;
    function generateResult() {
        return [random(), random(), random()];
    }
    Main.generateResult = generateResult;
    function generateResultBonus() {
        return [1, 10, 1];
    }
    Main.generateResultBonus = generateResultBonus;
    function generateResultWin() {
        return [1, 4, 7];
    }
    Main.generateResultWin = generateResultWin;
})(Main || (Main = {}));
var Main;
(function (Main) {
    Main.SPIN_RESULT = "spinResult";
    var Spinning = (function (_super) {
        __extends(Spinning, _super);
        function Spinning() {
            var _this = _super.call(this) || this;
            _this.results = [];
            return _this;
        }
        Spinning.prototype.Spin = function (type) {
            this.results = [];
            Main.SlotGame.totalReelStopped = 0;
            for (var i = 0; i < 3; i++) {
                switch (type) {
                    case 'normal':
                        this.results.push(Main.generateResult());
                        break;
                    case 'bonus':
                        this.results.push(Main.generateResultBonus());
                        break;
                    case 'winning':
                        this.results.push(Main.generateResultWin());
                        break;
                }
            }
            setTimeout(function () {
                Main.SlotGame.EventBus.emit(Main.SPIN_RESULT);
                Main.SlotGame.spinningStatus = 2;
            }, 1000);
        };
        Spinning.prototype.getResult = function (index) {
            return this.results[index];
        };
        return Spinning;
    }(PIXI.utils.EventEmitter));
    Main.Spinning = Spinning;
})(Main || (Main = {}));
var Main;
(function (Main) {
    var Bonus = (function (_super) {
        __extends(Bonus, _super);
        function Bonus() {
            var _this = _super.call(this) || this;
            _this.initialize();
            return _this;
        }
        Bonus.prototype.initialize = function () {
            var __this = this;
            var text = this.addChild(new PIXI.Text('Choose a chip', { fontFamily: 'Arial', fontSize: 40, fill: 0xff1010, align: 'center' }));
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
            this.item1.on('click', this.clickHandler, this);
            this.item2 = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            this.item2.anchor.set(.5);
            this.item2.position.set(370, 400);
            this.item2.scale.set(.1, .1);
            this.item2.alpha = 0;
            this.item2.name = 'item2';
            this.item2.on('click', this.clickHandler, this);
            this.item3 = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            this.item3.anchor.set(.5);
            this.item3.position.set(570, 400);
            this.item3.scale.set(.1, .1);
            this.item3.alpha = 0;
            this.item3.name = 'item3';
            this.item3.on('click', this.clickHandler, this);
            TweenLite.to(text, .5, { delay: .25, alpha: 1 });
            TweenLite.to(text.scale, .5, { delay: .25, x: 1, y: 1 });
            TweenLite.to(this.item1, .5, { delay: 1, alpha: 1 });
            TweenLite.to(this.item2, .5, { delay: 1.5, alpha: 1 });
            TweenLite.to(this.item3, .5, { delay: 2, alpha: 1 });
            TweenLite.to(this.item1.scale, .5, { delay: 1, x: 1, y: 1 });
            TweenLite.to(this.item2.scale, .5, { delay: 1.5, x: 1, y: 1 });
            TweenLite.to(this.item3.scale, .5, { delay: 2, x: 1, y: 1, onComplete: function () {
                    __this.item1.buttonMode = __this.item1.interactive = true;
                    __this.item2.buttonMode = __this.item2.interactive = true;
                    __this.item3.buttonMode = __this.item3.interactive = true;
                } });
        };
        Bonus.prototype.clickHandler = function (e) {
            this.item1.interactive = this.item1.buttonMode = false;
            this.item2.interactive = this.item2.buttonMode = false;
            this.item3.interactive = this.item3.buttonMode = false;
            this.bonusWin = Math.floor(Math.random() * (5 - 1 + 1)) + 2;
            var text = this.addChild(new PIXI.Text(this.bonusWin.toString() + "\nFree Spin", { fontFamily: 'Arial', fontSize: 40, fill: 0xff1010, align: 'center' }));
            text.anchor.set(.5);
            text.position.set(e.currentTarget.x, e.currentTarget.y);
            var __this = this;
            setTimeout(function () {
                __this.exitBonus();
            }, 3000);
        };
        Bonus.prototype.exitBonus = function () {
            TweenLite.to(this, .5, { delay: 2, alpha: 0, onComplete: Main.SlotGame.theme.endBonus(this.bonusWin) });
        };
        return Bonus;
    }(PIXI.Container));
    Main.Bonus = Bonus;
})(Main || (Main = {}));
var Main;
(function (Main) {
    var Freespin = (function (_super) {
        __extends(Freespin, _super);
        function Freespin(fsWon) {
            var _this = _super.call(this) || this;
            _this.fsAmount = fsWon;
            _this.initialize();
            return _this;
        }
        Freespin.prototype.initialize = function () {
            this.position.set(900, 120);
            this.holder = this.addChild(PIXI.Sprite.fromFrame("fs_holder.png"));
            var text = this.addChild(new PIXI.Text('Free Spin', { fontFamily: 'Arial', fontSize: 30, fill: 0x000000, align: 'center' }));
            text.anchor.set(.5);
            text.position.set(100, 40);
            this.txtFS = this.addChild(new PIXI.Text(this.fsAmount.toString(), { fontFamily: 'Arial', fontSize: 50, fill: 0x000000, align: 'center' }));
            this.txtFS.anchor.set(.5);
            this.txtFS.position.set(100, 140);
            TweenLite.to(this, .5, { x: 700 });
            setTimeout(function () {
                Main.SlotGame.theme.clickHandler();
            }, 2000);
        };
        Freespin.prototype.updateFS = function (_count) {
            this.txtFS.text = _count.toString();
        };
        Freespin.prototype.exit = function () {
            TweenLite.to(this, .5, { x: 900 });
            setTimeout(function () {
                Main.SlotGame.theme.endFreespin();
            }, 2000);
        };
        return Freespin;
    }(PIXI.Container));
    Main.Freespin = Freespin;
})(Main || (Main = {}));
