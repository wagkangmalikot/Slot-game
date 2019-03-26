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
