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
    Main.SPIN_RESULT = "spinResult";
    var Spinning = (function (_super) {
        __extends(Spinning, _super);
        function Spinning() {
            var _this = _super.call(this) || this;
            _this.results = [];
            return _this;
        }
        Spinning.prototype.Spin = function () {
            this.results = [];
            Main.SlotGame.totalReelStopped = 0;
            for (var i = 0; i < 3; i++) {
                this.results.push(Main.generateResult());
            }
            setTimeout(function () {
                Main.SlotGame.EventBus.emit(Main.SPIN_RESULT);
                Main.SlotGame.animationBehavior = 2;
            }, 1000);
        };
        Spinning.prototype.getResult = function (index) {
            return this.results[index];
        };
        return Spinning;
    }(PIXI.utils.EventEmitter));
    Main.Spinning = Spinning;
})(Main || (Main = {}));
