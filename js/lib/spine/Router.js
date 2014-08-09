define([
    "backbone.spine"
],function(
    Backbone
){
    var Router   =    Backbone.Router.extend({
        _app:   null,
        initialize: function(options){
            this._app   =   options.app;
        },
        start: function(){
            Backbone.history.start();
        },
        gotoRoute: function(route){
            route   =   typeof route=="string" ? route : '/';
            this.navigate(route,{trigger:true});
        }
    });
    
    return Router;
});