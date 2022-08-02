import Phaser from "phaser";

//const totalPlayers=4;
const gameState = {pickedCounter: 0};
let ibis,macaw,owl,toucan,anteater,ocelots, sluff,taper ,treefrog,goal,mp3_anteater,mp3_ibisa,mp3_ibisb,mp3_macawa,mp3_macawb,mp3_ocelots,mp3_sluff,mp3_taper,mp3_toucana,mp3_toucanb,mp3_treefrog,mp3_owla,mp3_owlb, mp3_final, mp3_singleTouch, coverSound,bgm;
let targets=[], decoys=[];
let targetsInGoal=0;
let sound_ibis,sound_macaw,sound_owl,sound_toucan,stone_destroy;
let scaleValueObjs, scaleValueGoalStone, scaleValue1, scaleValue2;


export default class GameScene extends Phaser.Scene{
    constructor(){
        super({key: 'Game'})
    }

    preload(){

        //load audio assets
        this.load.audio('one','assets/III-1-U-1-1.mp3')
        this.load.audio('two','assets/III-1-U-1-2.mp3')
        this.load.audio('three','assets/III-1-U-1-3.mp3')
        this.load.audio('four','assets/III-1-U-1-4.mp3')
        this.load.audio('owla','assets/owla.mp3')
        this.load.audio('owlb','assets/owlb.mp3')
        this.load.audio('ibisa','assets/ibisa.mp3')
        this.load.audio('ibisb','assets/ibisb.mp3')
        this.load.audio('macawa','assets/macawa.mp3')
        this.load.audio('macawb','assets/macawb.mp3')
        this.load.audio('toucana','assets/toucana.mp3')
        this.load.audio('toucanb','assets/toucanb.mp3')
        this.load.audio('anteater','assets/anteater.mp3')
        this.load.audio('ocelots','assets/ocelots.mp3')
        this.load.audio('treefrog','assets/treefrog.mp3')
        this.load.audio('sluff','assets/sluff.mp3')
        this.load.audio('taper','assets/taper.mp3')
        this.load.audio('final_audio','assets/allbirds.mp3')
        this.load.audio('singletouch','assets/singletouch.mp3')
        this.load.audio('coverSound','assets/I-1-U-2-CoverObject-Leaves.mp3')
        this.load.audio('bgm','assets/Uncover-Background-Music.mp3');
        this.load.audio('sound_owl','assets/owlsfx.mp3');
        this.load.audio('sound_ibis','assets/ibissfx.mp3');
        this.load.audio('sound_toucan','assets/toucansfx.mp3');
        this.load.audio('sound_macaw','assets/macawsfx.mp3');
        this.load.audio('stone_destroy','assets/TEMP-Multitouch-Object-Bounce-off-Uncover.mp3');



        //load bg

        this.load.image('bg','assets/III-1-U-1-background.png');

        //load goal
        this.load.image('goal','assets/III-1-U-1-goal-nest.png');

       // load targets
       targets=['owl','ibis','toucan','macaw'];
       decoys=['anteater','ocelots','sluff','taper','treefrog']
        for(let i=0;i<4;i++){
        //var target= targets[i]
        this.load.image(targets[i],'assets/'+targets[i]+'.png');
        }

        for(let i=0;i<5;i++){
            this.load.image(decoys[i],'assets/'+decoys[i]+'.png');
        }

        this.load.image('soil','assets/soil.png');


        for(let i=1;i<9;i++){
            this.load.image('cover'+i,'assets/cover'+i+'.png');
        }

        this.load.image('multitouch','assets/stone.png');


    }

    create(){
        const windowHeight = window.innerHeight * window.devicePixelRatio;
        const windowWidth = window.innerWidth *  window.devicePixelRatio;

        console.log('windowWidth, windowHeight--', windowWidth, windowHeight);

        this.scale.displaySize.setAspectRatio( windowWidth/windowHeight );
        this.scale.refresh();
        gameState.that=this;


        // gameState.scaleRatio = window.devicePixelRatio / 3;
        this.input.addPointer(50);
        gameState.pipelineInstanceOutline = this.plugins.get('rexOutlinePipeline');
        gameState.pipelineInstanceShadow = this.plugins.get('rexDropShadowPipeline');

        gameState.flash = this.plugins.get('rexFlash');

        // gameState.postFxPlugin = this.plugins.get('rexoutlinepipelineplugin');
        // gameState.glowFxPlugin = this.plugins.get('rexglowfilterpipelineplugin');
        let bg = this.add.image(0,0,'bg').setOrigin(0,0);
        bg.setDisplaySize(windowWidth, windowHeight);

    //scaling values for table devices
        if(windowWidth > 1900){
            scaleValueObjs = 0.8;
            scaleValueGoalStone = 0.9;
            scaleValue1 = 0.7;
            scaleValue2 = 0.6;
        } else {
            scaleValueObjs = 0.4;
            scaleValueGoalStone = 0.5;
            scaleValue1 = 0.3;
            scaleValue2 = 0.25;
        }

        // else if(windowWidth > 1500){
        //     scaleValueObjs = 0.5;
        //     scaleValueGoalStone = 0.6;
        //     scaleValue1 = 0.4;
        //     scaleValue2 = 0.3;
        // }

        let scaleValueGoal = scaleValueGoalStone;
        let scaleValueBirds = scaleValueObjs;
        let scaleValueDecoy = scaleValueObjs;
        let scaleValueLeafs = scaleValueObjs;
        let scaleValueStone = scaleValueGoalStone;
        let depthValueGoal = 50;
        let depthValueBirds = 10;
        let depthValueDecoy = 10;
        let depthValueLeafs = 25;
        let depthValueStone = 30;
        let depthValueSoil = 20;
        // let position = (30, 30, windowWidth - 100, windowHeight - 100);


        goal=this.add.image(45,62,'goal').setDepth(depthValueGoal);
        goal.setPosition((windowWidth)/2, (windowHeight)/2)
        // goal.setDisplaySize(350, 350);
        goal.setScale(scaleValueGoal);

        ibis= this.add.image(0,0,'ibis').setScale(scaleValueBirds).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueBirds);
        macaw= this.add.image(0,0,'macaw').setScale(scaleValueBirds).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueBirds);
        owl= this.add.image(0,0,'owl').setScale(scaleValueBirds).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueBirds);
        toucan= this.add.image(0,0,'toucan').setScale(scaleValueBirds).setInteractive({draggable: true}).setRandomPosition(70, 70, windowWidth - 100, windowHeight - 100).setDepth(depthValueBirds);

        this.checkGoalOverlapping(ibis);
        this.checkGoalOverlapping(macaw);
        this.checkGoalOverlapping(owl);
        this.checkGoalOverlapping(toucan);


        anteater= this.add.image(0,0,'anteater').setScale(scaleValueDecoy).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueDecoy);
        ocelots= this.add.image(0,0,'ocelots').setScale(scaleValueDecoy).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueDecoy);
        sluff= this.add.image(0,0,'sluff').setScale(scaleValueDecoy).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueDecoy);
        taper= this.add.image(0,0,'taper').setScale(scaleValueDecoy).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueDecoy);
        treefrog= this.add.image(0,0,'treefrog').setScale(scaleValueDecoy).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setDepth(depthValueDecoy);

        this.checkGoalOverlapping(anteater);
        this.checkGoalOverlapping(ocelots);
        this.checkGoalOverlapping(sluff);
        this.checkGoalOverlapping(taper);
        this.checkGoalOverlapping(treefrog);

        coverSound =this.sound.add("coverSound");
        //coverSound.play();
       bgm =this.sound.add("bgm");
        bgm.play();
        bgm.loop=true;
        bgm.setVolume(.3);
        let one= this.sound.add("one");
        one.play();
        let two= this.sound.add("two");
        let three= this.sound.add("three");
        let four= this.sound.add("four");

        mp3_anteater=this.sound.add("anteater");
        mp3_taper=this.sound.add("taper");
        mp3_treefrog=this.sound.add("treefrog");
        mp3_ocelots=this.sound.add("ocelots");
        mp3_sluff=this.sound.add("sluff");

        mp3_owla=this.sound.add("owla");
        mp3_owlb=this.sound.add("owlb");
        mp3_macawa=this.sound.add("macawa");
        mp3_macawb=this.sound.add("macawb");
        mp3_toucana=this.sound.add("toucana");
        mp3_toucanb=this.sound.add("toucanb");
        mp3_ibisa=this.sound.add("ibisa");
        mp3_ibisb=this.sound.add("ibisb");
        mp3_final=this.sound.add("final_audio");
        mp3_singleTouch=this.sound.add("singletouch");
        sound_ibis=this.sound.add("sound_ibis");
        sound_macaw=this.sound.add("sound_macaw");
        sound_owl=this.sound.add("sound_owl");
        sound_toucan=this.sound.add("sound_toucan");
        stone_destroy=this.sound.add("stone_destroy")
        this.addEvents(anteater);
        this.addEvents(ocelots);
        this.addEvents(sluff);
        this.addEvents(taper);
        this.addEvents(treefrog);

        this.addEvents(ibis);
        this.addEvents(macaw);
        this.addEvents(owl);
        this.addEvents(toucan);



        one.once("complete",function(){
            one.stop();
            two.play();
        });
        two.once("complete",function(){
            two.stop();
            three.play();
        });
        three.once("complete",function(){
            three.stop();
            four.play();
        });

        for(let i = 0; i < 6; i++){
            let soil = this.add.image(0,0, "soil").setInteractive({draggable: true}).setRandomPosition().setScale(scaleValueLeafs).setDepth(depthValueSoil);
            this.checkGoalOverlapping(soil);
            this.addEvents(soil);
        }

       for (let j=0;j<10;j++){
            for(let  i=1;i<9;i++){
                let cover = this.add.image(0,0, "cover"+i).setScale(scaleValueLeafs).setInteractive({draggable: true}).setRandomPosition(30, 30, windowWidth - 100, windowHeight - 100).setRotation(Math.random() * 10).setDepth(depthValueLeafs);
                this.checkGoalOverlapping(cover);
                this.addEvents(cover);
            }
        }


        let object=toucan.getBounds();
        let multitouch= this.add.image(0,0,"multitouch").setScale(scaleValueStone).setInteractive({draggable:true}).setPosition(object.x,object.y).setDepth(depthValueStone);

        this.checkGoalOverlapping(multitouch);
        multitouch.on("pointerdown",this.multitouchEvent);
        multitouch.on('pointerup', this.multitouchUpEvent);

    }


    addEvents(imgs){
        imgs
            .on('drag', this.startDrag)
            .on('dragend', this.stopDrag);
    }

    checkGoalOverlapping(obj){
        if(this.haveIntersection(obj)){
            const goalPosition = goal.getBounds();
            if(obj.x - goalPosition.x > goalPosition.width/2){
                obj.x = obj.x + goalPosition.width/2;
                obj.y = obj.y + goalPosition.height/2;
            } else {
                obj.x = obj.x - goalPosition.width/2;
                obj.y = obj.y - goalPosition.height/2;
            }
        }
    }

    haveIntersection(r1) {
    var r1Bounds = r1.getBounds();
    var goalBounds = goal.getBounds();
    return (
     r1Bounds.centerX > goalBounds.x &&
     r1Bounds.centerX < goalBounds.x + goalBounds.width &&
     r1Bounds.centerY > goalBounds.y &&
     r1Bounds.centerY < goalBounds.y + goalBounds.height
     );
    }

    addOutline(color, thick, obj){
        gameState.pipelineInstanceOutline.add(obj, {
            thickness: thick,
            outlineColor: color
        });
        gameState.pipelineInstanceShadow.add(obj, {
            distance: 5,
            angle: 45,
            shadowColor: color,
            alpha: 1,
            blur: 2,
            pixelWidth: 4,
            pixelHeight: 4
        });
    }
    removeOutline(obj){
        gameState.pipelineInstanceOutline.remove(obj);
        gameState.pipelineInstanceShadow.remove(obj);
    }

  startDrag(pointer,dragX,dragY){
    this.setDepth(90);
    if(this.texture.key.includes('cover')||this.texture.key.includes('soil')){
        coverSound.play();
    }

    if(!(gameState.that.haveIntersection(this))){
        if(!this.hasPostPipeline) {
            gameState.that.addOutline(0xFFFFFF, 2, this)
        }
    }
    // gameState.glowFxPlugin.remove(this);
    this.x = dragX;
    this.y = dragY;

}

  stopDrag(){
    this.hasPostPipeline = false;
    gameState.that.removeOutline(this);
    if(this.texture.key.includes('cover')||this.texture.key.includes('soil')){
        this.setDepth(5)

    }
    if ((targets.includes(this.texture.key) ) && gameState.that.haveIntersection(this)){
        gameState.that.addOutline(0x00FF00, 3, this);
        this.setDepth(55);
        switch (this.texture.key) {
            case 'owl':
                //gameState.that.sound.stopAll();
                mp3_owla.play();
                sound_owl.play();
                sound_owl.setVolume(.6);
                mp3_owla.once("complete",function(){
                    mp3_owla.stop();
                    sound_owl.stop();
                });
                targetsInGoal+=1
                break;
            case 'ibis':
                //gameState.that.sound.stopAll();
                mp3_ibisa.play();
                sound_ibis.play();
                sound_ibis.setVolume(.6);
                mp3_ibisa.once("complete",function(){
                    mp3_ibisa.stop();
                    sound_ibis.stop();
                });
                targetsInGoal+=1
                break;
            case 'macaw':
                //gameState.that.sound.stopAll();
                mp3_macawa.play();
                sound_macaw.play();
                sound_macaw.setVolume(.6);
                mp3_macawa.once("complete",function(){
                    mp3_macawa.stop();
                    sound_macaw.stop();
                });
                targetsInGoal+=1
                break;
            case 'toucan':
                //gameState.that.sound.stopAll();
                mp3_toucana.play();
                sound_toucan.play();
                sound_toucan.setVolume(.6);
                mp3_toucana.once("complete",function(){
                    mp3_toucana.stop();
                    sound_toucan.stop();
                });
                targetsInGoal+=1
                break;
            default:
                break;
           }
    setTimeout(()=>{
        gameState.that.removeOutline(this);
        const goalPosition = goal.getBounds();
        let x, y;
        if(this.texture.key === 'owl'){
            x = goalPosition.x+130;
            y = goalPosition.y+100;
        } else if(this.texture.key === 'ibis'){
            x = goalPosition.x+140;
            y = goalPosition.y+140;
        } else if(this.texture.key === 'toucan'){
            x = goalPosition.x+170;
            y = goalPosition.y+100;
        } else {
            x = goalPosition.x+90;
            y = goalPosition.y+120;
        }
        // var x = Phaser.Math.Between(goalPosition.x+90, goalPosition.x + goalPosition.width-130);
        // var y = Phaser.Math.Between(goalPosition.y+90, goalPosition.y + goalPosition.height-130);
        // this.setScale(.2);
        var object = this;
        gameState.that.tweens.add({
            targets: this,
            angle: 30,
            x: x,
            y: y,
            duration: 1000,
            ease: 'Sine.easeInOut',
            onStart: function () {
                setTimeout(() => {
                    object.setScale(.2);
                }, 1000);
            },
        });
        this.removeInteractive();
    },2000);
        if(targetsInGoal===4){
            setTimeout(()=>{
                mp3_final.play();
                gameState.that.addOutline(0xFFFFFF, 3, owl);
                gameState.that.addOutline(0xFFFFFF, 3, ibis);
                gameState.that.addOutline(0xFFFFFF, 3, toucan);
                gameState.that.addOutline(0xFFFFFF, 3, macaw);
                mp3_final.once('complete',function(){
                    mp3_final.stop();
                    setTimeout(()=>{
                        gameState.that.removeOutline(ibis);
                        gameState.that.removeOutline(toucan);
                        gameState.that.removeOutline(macaw);
                        mp3_owlb.play();
                        owl.setScale(scaleValue1).setDepth(100);
                    })
                })
            },3500)
                    mp3_owlb.once("complete",function(){
                    mp3_owlb.stop();
                    owl.setScale(scaleValue2).setDepth(55);
                    gameState.that.removeOutline(owl);
                    mp3_ibisb.play();
                    gameState.that.addOutline(0xFFFFFF, 3, ibis);
                    ibis.setScale(scaleValue1).setDepth(100);

                });

                mp3_ibisb.once("complete",function(){
                    mp3_ibisb.stop();
                    ibis.setScale(scaleValue2).setDepth(55);
                    gameState.that.removeOutline(ibis);
                    mp3_macawb.play();
                    gameState.that.addOutline(0xFFFFFF, 3, macaw);
                    macaw.setScale(scaleValue1).setDepth(100);
                });

                mp3_macawb.once("complete",function(){
                    mp3_macawb.stop();
                    macaw.setScale(scaleValue2).setDepth(55);
                    gameState.that.removeOutline(macaw);
                    mp3_toucanb.play();
                    gameState.that.addOutline(0xFFFFFF, 3, toucan);
                    toucan.setScale(scaleValue1).setDepth(100);
                });


                mp3_toucanb.once("complete",function(){
                mp3_toucanb.stop();
                gameState.that.removeOutline(toucan);
                toucan.setScale(scaleValue2).setDepth(55);
                setTimeout(()=>{
                    gameState.that.sound.stopAll();
                },10000)
                });



        }
    }
    else if ((decoys.includes(this.texture.key)) &&(gameState.that.haveIntersection(this))){
        gameState.that.addOutline(0xFF0000, 3, this);
        this.setDepth(60);
        switch (this.texture.key) {
            case 'sluff':
                //gameState.that.sound.stopAll();
                mp3_sluff.play();
                mp3_sluff.once("complete",function(){
                    mp3_owla.stop();

                });
                break;
            case 'taper':
                //gameState.that.sound.stopAll();
                mp3_taper.play();
                mp3_taper.once("complete",function(){
                    mp3_taper.stop();
                });
                break;
            case 'treefrog':
                //gameState.that.sound.stopAll();
                mp3_treefrog.play();
                mp3_treefrog.once("complete",function(){
                    mp3_treefrog.stop();
                });
                break;
            case 'anteater':
                //gameState.that.sound.stopAll();
                mp3_anteater.play();
                mp3_anteater.once("complete",function(){
                    mp3_anteater.stop();
                });
                break;
            case 'ocelots':
                //gameState.that.sound.stopAll();
                mp3_ocelots.play();
                mp3_ocelots.once('complete',function(){
                    mp3_ocelots.stop();
                });
                break;
            default:
                break;
           }
        //this.destroy();
        setTimeout(() => {
            gameState.that.tweens.add({
                targets: this,
                angle: 360,
                x: goal.getBounds().x + goal.getBounds().width + 100,
                ease: 'Sine.easeInOut'

            });

            gameState.that.tweens.add({
                targets: this,
                alpha: 0.2,
                ease: 'Sine.easeInOut'
            });
            setTimeout(() => {
                this.destroy();
            }, 1000);
        }, 1000);
    }

    }

    multitouchEvent(){
        if(gameState.that.input.pointer1.isDown && gameState.that.input.pointer2.isDown){
            gameState.that.removeOutline(this);
            gameState.that.addOutline(0xFFFFFF, 5, this)
            gameState.that.tweens.add({
                targets: this,
                angle: 360,
                x: gameState.that.input.pointer1.position.x + 100,
                y: gameState.that.input.pointer2.position.y + 100,
                ease: 'Sine.easeInOut'

            });

            gameState.that.tweens.add({
                targets: this,
                alpha: 0.2,
                ease: 'Sine.easeInOut'
            });
            stone_destroy.play();
            setTimeout(() => {
                this.destroy();
            }, 1000);

        } else if(gameState.that.input.pointer1.isDown){
            gameState.that.removeOutline(this);
            gameState.that.addOutline(0xFFFFFF, 3, this);
            mp3_singleTouch.play();
        }

        // if(gameState.that.input.mousePointer.isDown){
        //     gameState.that.addOutline(0xFFFFFF, 5, this);
        //     mp3_singleTouch.play();
        //     gameState.that.tweens.add({
        //         targets: this,
        //         angle: 360,
        //         x: gameState.that.input.mousePointer.position.x + 100,
        //         y: gameState.that.input.mousePointer.position.y + 100,
        //         ease: 'Sine.easeInOut'

        //     });

        //     gameState.that.tweens.add({
        //         targets: this,
        //         alpha: 0.2,
        //         ease: 'Sine.easeInOut'
        //     });
        //     setTimeout(() => {
        //         stone_destroy.play();
        //         this.destroy();
        //     }, 1000);
        // }

    }
    multitouchUpEvent() {
        gameState.that.removeOutline(this);
    }

}
