define([
    "xEvolution/app"
],function(
    app
){
    var model    =   app.Model.extend({
        _urlRoot:   "",
        defaults:   {
            speed:                  5,
            movementSpeed:          2,
            borderColor:            "rgba(255,255,0,1)",
            borderWidth:            1,
            fillColor:              "rgba(0,0,0,1)",
            x:                      -1,
            y:                      -1,
            width:                  3,
            height:                 3,
            maxAge:                 1000,
            currentAge:             0,
            dead:                   false,
            ticksDead:              0,
            maxTicksDead:           100,
            decomposed:             false,
            maxHunger:              100,
            hunger:                 0,
            ticksAtMaxHunger:       0,
            ticksAboveHalf:         0,
            maxTicksAtMaxHunger:    21
        },
        board:          null,
        canvasContext:  null,
        initialize: function(properties,options){
            this.board          =   options.board;
            this.canvasContext  =   this.board.canvas.getCanvasContext();
            this.on('change',this.update);
            this.draw();
            this.listenTo(this.board,'tick',this.doTick);
        },
        update: function(){
            this.checkHunger();
            this.checkDecompose();
            this.clearPrevious();
            
            this.draw();
        },
        clearPrevious: function(){
            var pX  =   this.previous('x');
            var pY  =   this.previous('y');
            var pW  =   this.previous('width');
            var pH  =   this.previous('height');
            
            this.clear(pX,pY,pW,pH);
        },
        checkHunger: function(){
            var ticksAtMaxHunger    =   this.get('ticksAtMaxHunger');
            var maxTicksAtMaxHunger =   this.get('maxTicksAtMaxHunger');
            
            if(!this.get('dead') && ticksAtMaxHunger>=maxTicksAtMaxHunger){
                this.set({
                    dead: true
                });
                console.log("Creature died of hunger");
            }
        },
        checkDecompose: function(){
            var ticksDead       =   this.get('ticksDead');
            var maxTicksDead    =   this.get('maxTicksDead');
            if(!this.get('decomposed') && ticksDead>=maxTicksDead){
                this.set({
                    decomposed: true
                });
                console.log("Creature has decomposed");
            }
        },
        clear: function(x,y,w,h){
            this.canvasContext.fillStyle    =   "#fff";
            this.canvasContext.fillRect(x,y,w,h);
        },
        draw: function(){
            var x           =   Number(this.get('x'));
            var y           =   Number(this.get('y'));
            var width       =   Number(this.get('width'));
            var height      =   Number(this.get('height'));
            var borderColor =   this.get('borderColor');
            var borderWidth =   Number(this.get('borderWidth')) || 0;
            var fillColor   =   this.get('fillColor');
            
            this.clear(x,y,width,height);
            
            if(isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || !fillColor){
                /*
                 * throw new Error("Unable to draw creature");
                 */
                console.log("Unable to draw creature: "+x+","+y+" "+width+"x"+height+": "+fillColor);
                return;
            }
            
            if(borderColor && borderWidth){
                this.canvasContext.fillStyle    =   borderColor;
                this.canvasContext.fillRect(x,y,width,height);
            }
            this.canvasContext.fillStyle    =   fillColor;
            this.canvasContext.fillRect(x+borderWidth,y+borderWidth,width-borderWidth*2,height-borderWidth*2);
         },
         getMoveLocation: function(){
             var random =   Math.floor(Math.random()*9);
             var x          =   Number(this.get('x'));
             var y          =   Number(this.get('y'));
             var moveSpeed  =   Number(this.get('movementSpeed'));
             var dx         =   0;
             var dy         =   0;
             switch(random){
                 case 0:    //west
                     dx =   -1;
                     break;
                 case 1:    //east
                     dx =   1;
                     break;
                 case 2:    //north
                     dy =   -1;
                     break;
                 case 3:    //south
                     dy =   1;
                     break;
                 case 4:    //north-west
                     dy =   -1;
                     dx =   -1;
                     break;
                 case 5:    //north-east
                     dy =   -1;
                     dx =   1;
                     break;
                 case 6:    //south-east
                     dy =   1;
                     dx =   1;
                     break;
                 case 7:    //south-west
                     dy =   1;
                     dx =   -1;
                     break;
                 default:
                     break;
             }
             return {
                 x: x+(dx*moveSpeed),
                 y: y+(dy*moveSpeed)
             };
         },
         hunger: function(ammount){
            if(!ammount){
                ammount =   Number(this.get('movementSpeed'));
            }
            var hunger              =   Number(this.get('hunger'))+ammount;
            var maxHunger           =   Number(this.get('maxHunger'));
            var ticksAtMaxHunger    =   Number(this.get('ticksAtMaxHunger'));
            if(hunger>=maxHunger){
                ticksAtMaxHunger++;
            }
            this.set({
               hunger:              hunger,
               ticksAtMaxHunger:    ticksAtMaxHunger
            });
         },
         decompose: function(){
            if(this.get('dead') && !this.get('decomposed')){
                var ticksDead       =   Number(this.get('ticksDead'))+1;
                var fillColor       =   this.board.canvas.RGBAColor(this.get('fillColor'));
                var borderColor     =   this.board.canvas.RGBAColor(this.get('borderColor'));
                var maxTicksDead    =   Number(this.get('maxTicksDead'));
                var fA              =   (maxTicksDead-ticksDead)/maxTicksDead;
                fillColor.a         =   fA;
                borderColor.a       =   fA;
                this.set({
                    ticksDead:      ticksDead,
                    fillColor:      fillColor.toString(),
                    borderColor:    borderColor.toString()
                });
            }
         },
         age: function(ticks){
             ticks      =   isNaN(ticks) ? 1 : ticks;
             if(!this.get('dead')){
                var age    =   Number(this.get('age'));
                this.set({
                    age:   age+ticks
                });
            }
         },
         doTick: function(){
            this.hunger();
            this.move();
            this.decompose();
            this.age();
            
         },
         move: function(){
             if(!this.get('dead')){
                var newPosition    =   this.getMoveLocation();
                this.set(newPosition);
            }
         }
    });
    return model;
});