namespace Main {
    export class Freespin extends PIXI.Container {
        private holder: PIXI.Sprite;
        private txtFS: PIXI.Text;
        private fsAmount:Number;
        constructor(fsWon: number) {
            super();
            this.fsAmount = fsWon;// the free spin amount won in the bos game
            this.initialize();
        }
        public initialize() {
            this.position.set(900, 120);
            this.holder = this.addChild(PIXI.Sprite.fromFrame("fs_holder.png")); //image bg for the free spin count

            let text = this.addChild(new PIXI.Text('Free Spin',{fontFamily : 'Arial', fontSize: 30, fill : 0x000000, align : 'center'}));//Free spin label text
            text.anchor.set(.5);
            text.position.set(100, 40);

            this.txtFS = this.addChild(new PIXI.Text(this.fsAmount.toString(),{fontFamily : 'Arial', fontSize: 50, fill : 0x000000, align : 'center'}));// Free spin won amount text
            this.txtFS.anchor.set(.5);
            this.txtFS.position.set(100, 140);

            TweenLite.to(this, .5, {  x: 700 });// intro anuimation of free spin feature
            setTimeout(function(){
                SlotGame.theme.clickHandler();
           }, 2000);
        }
        public updateFS(_count:number){//will update the fre spin amount in every spin
            this.txtFS.text = _count.toString();
        }
        public exit(){// exit animation of free spin feature
            TweenLite.to(this, .5, {  x: 900 });
            setTimeout(function(){
                SlotGame.theme.endFreespin();
           }, 2000);
        }
    }
}