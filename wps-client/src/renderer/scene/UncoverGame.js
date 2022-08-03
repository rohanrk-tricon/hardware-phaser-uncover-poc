import Phaser from "phaser";
import Pointer from "phaser/src/input/Pointer";

const totalPlayers=4;
const gameState = {pickedCounter: 0};
let ibis,macaw,owl,toucan,anteater,ocelots, sluff,taper ,treefrog,goal,mp3_anteater,mp3_ibisa,mp3_ibisb,mp3_macawa,mp3_macawb,mp3_ocelots,mp3_sluff,mp3_taper,mp3_toucana,mp3_toucanb,mp3_treefrog,mp3_owla,mp3_owlb, mp3_final, mp3_singleTouch, coverSound,bgm;
let targets=[], decoys=[];
let targetsInGoal=0;
let sound_ibis,sound_macaw,sound_owl,sound_toucan,stone_destroy;
let scaleValueObjs, scaleValueGoalStone, scaleValue1, scaleValue2;


export default class UncoverGameScene extends Phaser.Scene{
    constructor(){
        super({key: 'Game'})
    }

    preload(){

        //load audio assets
        this.load.audio('one','../../../public/assets/III-1-U-1-1.mp3')
        this.load.audio('two','../../../public/assets/III-1-U-1-2.mp3')
        this.load.audio('three','../../../public/assets/III-1-U-1-3.mp3')
        this.load.audio('four','../../../public/assets/III-1-U-1-4.mp3')
        this.load.audio('owla','../../../public/assets/owla.mp3')
        this.load.audio('owlb','../../../public/assets/owlb.mp3')
        this.load.audio('ibisa','../../../public/assets/ibisa.mp3')
        this.load.audio('ibisb','../../../public/assets/ibisb.mp3')
        this.load.audio('macawa','../../../public/assets/macawa.mp3')
        this.load.audio('macawb','../../../public/assets/macawb.mp3')
        this.load.audio('toucana','../../../public/assets/toucana.mp3')
        this.load.audio('toucanb','../../../public/assets/toucanb.mp3')
        this.load.audio('anteater','../../../public/assets/anteater.mp3')
        this.load.audio('ocelots','../../../public/assets/ocelots.mp3')
        this.load.audio('treefrog','../../../public/assets/treefrog.mp3')
        this.load.audio('sluff','../../../public/assets/sluff.mp3')
        this.load.audio('taper','../../../public/assets/taper.mp3')
        this.load.audio('final_audio','../../../public/assets/allbirds.mp3')
        this.load.audio('singletouch','../../../public/assets/singletouch.mp3')
        this.load.audio('coverSound','../../../public/assets/I-1-U-2-CoverObject-Leaves.mp3')
        this.load.audio('bgm','../../../public/assets/Uncover-Background-Music.mp3');
        this.load.audio('sound_owl','../../../public/assets/owlsfx.mp3');
        this.load.audio('sound_ibis','../../../public/assets/ibissfx.mp3');
        this.load.audio('sound_toucan','../../../public/assets/toucansfx.mp3');
        this.load.audio('sound_macaw','../../../public/assets/macawsfx.mp3');
        this.load.audio('stone_destroy','../../../public/assets/TEMP-Multitouch-Object-Bounce-off-Uncover.mp3');


        
        //load bg
        
        this.load.image('bg','../../../public/assets/III-1-U-1-background.png');

        //load goal
        this.load.image('goal','../../../public/assets/III-1-U-1-goal-nest.png');

       // load targets
       targets=['owl','ibis','toucan','macaw'];
       decoys=['anteater','ocelots','sluff','taper','treefrog']
        for(let i=0;i<4;i++){
        //var target= targets[i]
        this.load.image(targets[i],'../../../public/assets/'+targets[i]+'.png');
        }

        for(let i=0;i<5;i++){
            this.load.image(decoys[i],'../../../public/assets/'+decoys[i]+'.png');
        }

        this.load.image('soil','../../../public/assets/soil.png');


        for(let i=1;i<9;i++){
            this.load.image('cover'+i,'../../../public/assets/cover'+i+'.png');
        }

        this.load.image('multitouch','../../../public/assets/stone.png');


    }

    create(){
        const windowHeight = window.innerHeight * window.devicePixelRatio;
        const windowWidth = window.innerWidth *  window.devicePixelRatio;

        console.log('windowWidth, windowHeight--', windowWidth, windowHeight);

        this.scale.displaySize.setAspectRatio( windowWidth/windowHeight );
        this.scale.refresh();
        gameState.that=this;
        
        
        // gameState.scaleRatio = window.devicePixelRatio / 3;
        // this.input.addPointer(50);
       
        // 50 simultaneous touches.

        const requiredPointers = 50;
        for(let i = 0; i < requiredPointers; i++){
            const id = this.input.manager.pointers.length;
            const pointer = new Pointer(this.input.manager, id);
            pointer.smoothFactor = this.input.manager.config.inputSmoothFactor;
            this.input.manager.pointers.push(pointer);
            this.input.manager.pointersTotal++;
        }

        this.updatePointers(this);

        gameState.pipelineInstanceOutline = this.plugins.get('rexOutlinePipeline');
        gameState.pipelineInstanceShadow = this.plugins.get('rexDropShadowPipeline');

        gameState.flash = this.plugins.get('rexFlash');

        // gameState.postFxPlugin = this.plugins.get('rexoutlinepipelineplugin');
        // gameState.glowFxPlugin = this.plugins.get('rexglowfilterpipelineplugin');
        let bg = this.add.image(0,0,'bg').setOrigin(0,0);
        bg.setDisplaySize(windowWidth, windowHeight);

    //scaling values for table devices
        if(windowWidth > 1900){
            scaleValueObjs = 0.7;
            scaleValueGoalStone = 0.8;
            scaleValue1 = 0.6;
            scaleValue2 = 0.5;  
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
        bgm.setVolume(.3);
        bgm.loop = true;
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
                cover.on("pointerdown",this.pickCovers);
            }
        }
        
        
        let object=toucan.getBounds();
        let multitouch= this.add.image(0,0,"multitouch").setScale(scaleValueStone).setInteractive({draggable:true}).setPosition(object.x,object.y).setDepth(depthValueStone);
        
        this.checkGoalOverlapping(multitouch);
        multitouch.on("pointerdown",this.multitouchEvent);
        multitouch.on('pointerup', this.multitouchUpEvent); 

    }

    pickCovers(){
        coverSound.play(); 
    }

    updatePointers(){
        gameState.that.input._drag = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [], 11: [],
                                        12: [], 13: [], 14: [], 15: [], 16: [], 17: [], 18: [], 19: [], 20: [], 21: [], 22: [],
                                        23: [], 24: [], 25: [], 26: [], 27: [], 28: [], 29: [], 30: [], 31: [], 32: [], 33: [],
                                        34: [], 35: [], 36: [], 37: [], 38: [], 39: [], 40: [], 41: [], 42: [], 43: [], 44: [],
                                        45: [], 46: [], 47: [], 48: [], 49: [], 50: []};
        gameState.that.input._dragState = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                                            0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

        gameState.that.input.pointer11 = gameState.that.input.manager.pointers[11];
        gameState.that.input.pointer12 = gameState.that.input.manager.pointers[12];
        gameState.that.input.pointer13 = gameState.that.input.manager.pointers[13];
        gameState.that.input.pointer14 = gameState.that.input.manager.pointers[14];
        gameState.that.input.pointer15 = gameState.that.input.manager.pointers[15];
        gameState.that.input.pointer16 = gameState.that.input.manager.pointers[16];
        gameState.that.input.pointer17 = gameState.that.input.manager.pointers[17];
        gameState.that.input.pointer18 = gameState.that.input.manager.pointers[18];
        gameState.that.input.pointer19 = gameState.that.input.manager.pointers[19];
        gameState.that.input.pointer20 = gameState.that.input.manager.pointers[20];
        gameState.that.input.pointer21 = gameState.that.input.manager.pointers[21];
        gameState.that.input.pointer22 = gameState.that.input.manager.pointers[22];
        gameState.that.input.pointer23 = gameState.that.input.manager.pointers[23];
        gameState.that.input.pointer24 = gameState.that.input.manager.pointers[24];
        gameState.that.input.pointer25 = gameState.that.input.manager.pointers[25];
        gameState.that.input.pointer26 = gameState.that.input.manager.pointers[26];
        gameState.that.input.pointer27 = gameState.that.input.manager.pointers[27];
        gameState.that.input.pointer28 = gameState.that.input.manager.pointers[28];
        gameState.that.input.pointer29 = gameState.that.input.manager.pointers[29];
        gameState.that.input.pointer30 = gameState.that.input.manager.pointers[30];
        gameState.that.input.pointer31 = gameState.that.input.manager.pointers[31];
        gameState.that.input.pointer32 = gameState.that.input.manager.pointers[32];
        gameState.that.input.pointer33 = gameState.that.input.manager.pointers[33];
        gameState.that.input.pointer34 = gameState.that.input.manager.pointers[34];
        gameState.that.input.pointer35 = gameState.that.input.manager.pointers[35];
        gameState.that.input.pointer36 = gameState.that.input.manager.pointers[36];
        gameState.that.input.pointer37 = gameState.that.input.manager.pointers[37];
        gameState.that.input.pointer38 = gameState.that.input.manager.pointers[38];
        gameState.that.input.pointer39 = gameState.that.input.manager.pointers[39];
        gameState.that.input.pointer40 = gameState.that.input.manager.pointers[40];
        gameState.that.input.pointer41 = gameState.that.input.manager.pointers[41];
        gameState.that.input.pointer42 = gameState.that.input.manager.pointers[42];
        gameState.that.input.pointer43 = gameState.that.input.manager.pointers[43];
        gameState.that.input.pointer44 = gameState.that.input.manager.pointers[44];
        gameState.that.input.pointer45 = gameState.that.input.manager.pointers[45];
        gameState.that.input.pointer46 = gameState.that.input.manager.pointers[46];
        gameState.that.input.pointer47 = gameState.that.input.manager.pointers[47];
        gameState.that.input.pointer48 = gameState.that.input.manager.pointers[48];
        gameState.that.input.pointer49 = gameState.that.input.manager.pointers[49];
        gameState.that.input.pointer50 = gameState.that.input.manager.pointers[50];
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
    // if(this.texture.key.includes('cover')||this.texture.key.includes('soil')){
    //     // coverSound.play();   
    // }

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
    if(gameState.that.haveIntersection(this) && (this.texture.key.includes('cover') || this.texture.key.includes('soil'))){
        this.setDepth(5)
    }
    if ((targets.includes(this.texture.key) ) && gameState.that.haveIntersection(this)){
        gameState.that.addOutline(0x00FF00, 3, this);
        
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

        if(gameState.that.input.mousePointer.isDown){
            gameState.that.addOutline(0xFFFFFF, 5, this);
            mp3_singleTouch.play();
            gameState.that.tweens.add({
                targets: this,
                angle: 360,
                x: gameState.that.input.mousePointer.position.x + 100,
                y: gameState.that.input.mousePointer.position.y + 100,
                ease: 'Sine.easeInOut'
            });

            gameState.that.tweens.add({
                targets: this,
                alpha: 0.2,
                ease: 'Sine.easeInOut'
            });
            setTimeout(() => {
                stone_destroy.play();
                this.destroy();
            }, 1000);
        }
        
    }
    multitouchUpEvent() {
        gameState.that.removeOutline(this);
    }
    
}