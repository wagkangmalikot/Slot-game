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
    var Bonus = (function (_super) {
        __extends(Bonus, _super);
        function Bonus() {
            var _this = _super.call(this) || this;
            _this.initialize();
            return _this;
        }
        Bonus.prototype.initialize = function () {
            var items = this.addChild(PIXI.Sprite.fromFrame("selected.png"));
            items.position.set(200, 220);
        };
        return Bonus;
    }(PIXI.Container));
    Main.Bonus = Bonus;
})(Main || (Main = {}));
