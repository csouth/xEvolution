define([
    "spine/Router",
    "xEvolution/views/Header",
    "xEvolution/views/Canvas"
],function(
    Router,
    Header,
    Canvas
){
    var router  =   Router.extend({
        headerView:   null,
        canvasView:   null,
        routes: {
           '':      'indexRoute'
        },
        initialize: function(){
            this.canvasView   =   new Canvas();
            this.canvasView.place('body','append');
            
            this.header =   new Header({
                canvas: this.canvasView
            });
            this.header.place('body','prepend');
            
            
        },
        
        indexRoute: function(){
            
        }
    });
    
    return router;
});