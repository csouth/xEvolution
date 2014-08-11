define([
    "xEvolution/app",
    "xEvolution/models/Board"
],function(
    app,
    Board
){
    var view    =   app.View.extend({
        _templateUrl:   "canvas.html",
        className:      "canvas",
        tagName:        "div",
        board:          null,
        width:          0,
        height:         0,
        events: {
            
        },
        initialize: function(options){
            this.on('place:complete',this.setDimensions);
            this.on('resize:complete',this.setDimensions);
            this.board  =   new Board(null,{canvas:this});
        },
        setDimensions: function(){
            this.width  =   this.$el.innerWidth();
            this.height =   this.$el.innerHeight();
            this.$('canvas').attr({
                width:  this.width,
                height: this.height
            });
        },
        getCanvasContext: function(){
            var canvas  =   this.$('canvas')[0];
            if(canvas){
                return canvas.getContext('2d');
            }
            return null;
        },
        getViewData: function(){
            return {};
        },
        action: function(action){
            if(typeof this.board[action]==="function"){
                this.board[action]();
            }
        },
        RGBAColor: function(color,opacity){
            var rgbColorDefault    =   {
                r:  0,
                g:  0,
                b:  0,
                a:  0,
                toString:   function(){
                    return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")";
                }
            };
            var rgbColor    =   rgbColorDefault;
            if(typeof color=="object"){
                color.a         =   isNaN(opacity) ? color.a : (opacity>1) ? opacity/100 : opacity;
                rgbColor        =   color;
            }else if(color.indexOf("rgba")!==-1){
                color       =   color.replace(/rgba\(|\)/gi,"");
                var colors  =   color.split(",");
                var r       =   colors[0];
                var g       =   colors[1];
                var b       =   colors[2];
                var a       =   isNaN(opacity) ? colors[3] : (opacity>1) ? opacity/100 : opacity;
                rgbColor    =   {
                    r:  r,
                    g:  g,
                    b:  b,
                    a:  a
                };
            }else{
                rgbColor            =    this.hexColorToRGBA(color,opacity);
            }
            rgbColor.toString   =   rgbColorDefault.toString;
            return rgbColor;
        },
        hexColorToRGBA: function(hexColor,opacity){
            hexColor        =   hexColor.replace('#','');
            var r           =   parseInt(hexColor.substring(0,2),16);
            var g           =   parseInt(hexColor.substring(2,4),16);
            var b           =   parseInt(hexColor.substring(4,6),16);
            var a           =   isNaN(opacity) ? 1 : (opacity>1) ? opacity/100 : opacity;
            var rgbColor    =   {
                r:  r,
                g:  g,
                b:  b,
                a:  a
            };
            return rgbColor;
        }
    });
    return view;
});