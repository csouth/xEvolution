define([
    "xEvolution/app"
],function(
    app
){
    var model    =   app.Model.extend({
        _urlRoot:   "",
        defaults:   {
            x:              -1,
            y:              -1,
            
            width:          3,
            height:         3,
            
            borderColor:    "rgba(255,255,0,1)",
            borderWidth:    1,
            
            fillColor:      "rgba(0,0,0,1)",
        },
        board:          null,
        canvasContext:  null,
        initialize: function(properties,options){
            this.board          =   options.board;
            this.on('change',this._clearPrevious);
            this.on('change',this._draw);
        },
        _getCanvasContext: function(){
            if(!this.canvasContext){
                this.canvasContext  =   this.board.canvas.getCanvasContext();
            }
            return this.canvasContext;
        },
        _clearPrevious: function(){
            var pX  =   this.previous('x');
            var pY  =   this.previous('y');
            var pW  =   this.previous('width');
            var pH  =   this.previous('height');
            
            this._clear(pX,pY,pW,pH);
        },
        _clear: function(x,y,w,h){
            if(!this._getCanvasContext()){
                return;
            }
            this.canvasContext.fillStyle    =   "#fff";
            this.canvasContext.fillRect(x,y,w,h);
        },
        _draw: function(){
            if(!this._getCanvasContext()){
                return;
            }
            var x           =   Number(this.get('x'));
            var y           =   Number(this.get('y'));
            var width       =   Number(this.get('width'));
            var height      =   Number(this.get('height'));
            var borderColor =   this.get('borderColor');
            var borderWidth =   Number(this.get('borderWidth')) || 0;
            var fillColor   =   this.get('fillColor');
            
            this._clear(x,y,width,height);
            
            if(isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) || !fillColor){
                /*
                 * throw new Error("Unable to draw creature");
                 */
                console.log("Unable to draw creature: "+x+" , "+y+" "+width+" x "+height+": "+fillColor);
                return;
            }
            
            if(borderColor && borderWidth){
                this.canvasContext.fillStyle    =   borderColor;
                this.canvasContext.fillRect(x,y,width,height);
            }
            //console.log(x+","+y+" "+width+"x"+height+" - "+fillColor);
            this.canvasContext.fillStyle    =   fillColor;
            this.canvasContext.fillRect(x+borderWidth,y+borderWidth,width-borderWidth*2,height-borderWidth*2);
        }
    });
    return model;
});