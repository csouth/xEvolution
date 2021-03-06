define([
    "xEvolution/app"
],function(
    app
){
    var view    =   app.View.extend({
        _templateUrl:   "header.html",
        className:      "",
        tagName:        "header",
        canvasView:     null,
        events: {
            "click .clickable":      "action",
            "touchstart .clickable": "action"
        },
        initialize: function(options){
            this.canvasView =   options.canvas;
        },
        getViewData: function(){
            return {};
        },
        action: function(event){
            var action   =   $(event.currentTarget).data('action');
            this.canvasView.action(action);
        }
    });
    return view;
});