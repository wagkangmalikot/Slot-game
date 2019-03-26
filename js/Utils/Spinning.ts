module Main {
    export const SPIN_RESULT = "spinResult";
    export class Spinning extends PIXI.utils.EventEmitter {
        private results: Array<number[]> = [];
        constructor() {
            super();
        }

        public Spin(type: string) {
            this.results = [];
            SlotGame.totalReelStopped = 0;
            for (let i = 0; i < 3; i++) {
                switch(type){
                    case 'normal':
                    this.results.push(generateResult());//the deault random result in every spin
                    break;
                    case 'bonus':
                    this.results.push(generateResultBonus());// just to force the game to win bonus
                    break;
                    case 'winning':
                    this.results.push(generateResultWin());// just to force the game to win symbols
                    break;
                }
                
            }
            setTimeout(
                function () {
                    SlotGame.EventBus.emit(SPIN_RESULT);
                    SlotGame.spinningStatus = 2;
                }
                , 1000);

        }

        public getResult(index:number) {
            return this.results[index];
        }
    }
}
