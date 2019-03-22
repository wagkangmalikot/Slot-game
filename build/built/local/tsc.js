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
            var reelBG = PIXI.Texture.fromImage("frameBackground.jpg");
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
        };
        return SlotTheme;
    }(PIXI.Container));
    Main.SlotTheme = SlotTheme;
})(Main || (Main = {}));
