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
            _this.animationBehavior = 0; //0 = complete stop, 1 = spin, 2 = stopping 
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
                this.animationBehavior = 0;
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
