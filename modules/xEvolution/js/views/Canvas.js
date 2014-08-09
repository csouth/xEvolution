define([
    "xEvolution/app",
    "xEvolution/models/Board"
],function(
    app,
    Board
){
    var view    =   app.View.extend({
        _templateUrl:   "",
        className:      "",
        tagName:        "canvas",
        board:          null,
        width:          0,
        height:         0,
        events: {
            
        },
        initialize: function(options){
            this.board  =   new Board(null,{canvas:this});
            this.on('place:complete',this.setDimensions);
            this.on('resize:complete',this.setDimensions);
        },
        setDimensions: function(){
            this.width  =   this.$el.innerWidth();
            this.height =   this.$el.innerHeight();
        },
        getViewData: function(){
            return {};
        },
        action: function(action){
            if(typeof this.board[action]==="function"){
                this.board[action]();
            }
        }
    });
    return view;
});