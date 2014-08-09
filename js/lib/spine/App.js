//  Spine App v0.1: Backbone Implementation

//  The Spine App uses a Backbone model as the main configuration
//  object. All extending Spine views, models, and collections
//  access the app through their internal _app property which
//  is specific to the implemented module. This allows a central
//  reference point for all components of a module. 
//
//  The Spine App also manages a local storage / cookie system for
//  changeable configuration directives. Any module configuration options
//  that do not begin with an underscore (_) are considered user-changable
//  and will be saved to the browser upon being changed, and loaded upon
//  initialization of the application

//  The default save and fetch methods of the Backbone model have been
//  overwritten to direct saving and loading to local storage / cookies

define([
    "require",
    "jquery",
    "underscore.extendr",
    "backbone.spine",
    "spine/Router",
    "spine/Model",
    "spine/Collection",
    "spine/View"
],function(
    require,
    $,
    _,
    Backbone,
    Router,
    Model,
    Collection,
    View
){
    var App   =   Backbone.Model.extend({
        Model:              null,
        Collection:         null,
        View:               null,
        _moduleId:          null,
        _router:            null,
        _children:          [],
        initialize: function(props,options){
            this._setupComponents();
            this.fetch();
            this.on('change',this.save);
        },
        start: function(){
            if(!this._router && this.get('_router')){
                var app =   this;
                require([this.get("_router")],function(Router){
                    app._router =   new Router(app);
                    app.start();
                });
                return;
            }
            if(!this._router){
                throw new Error("Unable to start application: Missing Router");
            }
            if(window){
                $(window).on('resize',null,{app:this},this._notifyResize);
            }
            this._addStyleSheets(this.get('_css'));
            this._router.start();
            
        },
        navigate: function(route,options){
            if(this._router){
                this._router.navigate(route,options);
            }
        },
        _notifyResize: function(event){
            if(event && event.data && event.data.app){
                event.data.app.trigger('resize');
            }
        },
        _addStyleSheets: function(css){
            if(css){
                if(typeof css === "string"){
                    var link    =   $('<link>').attr({
                        type:   'text/css',
                        rel:    'stylesheet',
                        href:   css
                    });
                    $('head').append(link);
                }else{
                    for(var i in css){
                        this._addStyleSheets(css[i]);
                    }
                }
            }
        },
        _setupComponents: function(){
            this.Model      =   Model.extend({_app:this});
            this.View       =   View.extend({_app:this});
            this.Collection =   Collection.extend({_app:this});
        },
        _setupListeners: function(child){
            if(!child){
                return;
            }
            if(_.isArray(child)){
                for(var i in child){
                    this._setupListeners(child[i]);
                }
            }else if( (child instanceof Backbone.Model) || (child instanceof Backbone.Collection) ){
                this.listenTo(child,'error',this._notifyError);
                this.listenTo(child,'request',this._notifyLoadStart);
                this.listenTo(child,'sync',this._notifyLoadStop);
                this.listenTo(child,'destroy',this._removeChild);
            }else if(child instanceof Backbone.View){
                this.listenTo(child,'load:start',this._notifyLoadStart);
                this.listenTo(child,'load:complete',this._notifyLoadStop);
                this.listenTo(child,'load:error',this._notifyError);
            }
        },
        _notifyError: function(child,response,options){
            this._notifyLoadStop(child);
            this.trigger('load:error',child,response,options);
        },
        _notifyLoadStart: function(child){
            this.trigger('load:start',child);
        },
        _notifyLoadStop: function(child){
            this.trigger('load:stop',child);
        },
        _removeChild: function(child){
            if(!child){
                return;
            }
            if(_.isArray(child)){
                for(var i in child){
                    this._removeChild(child[i]);
                }
            }else if(this._children.indexOf(child)!==-1){
                this.stopListening(child);
                this._children.splice(this._children.indexOf(child),1);
            }
        },
        _readLocalStorage: function(){
            for(var e in this.attributes){
                if(e.indexOf('_')!==0){
                    var item    =   window.localStorage.getItem(e);
                    try{
                        item    =   JSON.parse(item);
                    }catch(ex){}
                    if(item){
                        this.set(e,item);
                    }
                }
            }
        },
        _writeLocalStorage: function(){
            for(var e in this.attributes){
                if(e.indexOf('_')!==0){
                    var item    =   this.get(e);
                    if(item.toRecursiveJSON){
                        item    =   item.toRecursiveJSON();
                    }else if(item.toJSON){
                        item    =   item.toJSON();
                    }
                    window.localStorage.setItem(e,JSON.stringify(item));
                }else{
                    window.localStorage.removeItem(e);
                }
            }
        },
        _getCookie:  function(){
            var ca      =   document.cookie.split(';');
            var find    =   this.get("_cookieName")+"=";
            for(var i=0;i < ca.length;i++) {
                var c = ca[i];
                while (c.charAt(0)==' '){ 
                    c = c.substring(1,c.length);
                }
                if (c.indexOf(find) === 0){ 
                    return c.substring(find.length,c.length);
                }
            }
            return null;
        },
        _readCookieStorage: function(){
            try{
                var cookie  =   JSON.parse(this._getCookie());
                if(cookie){
                    for(var e in cookie){
                        if(e.indexOf("_")!==0){
                            this.set(e,cookie[e]);
                        }
                    }
                }
            }catch(ex){}
        },
        _writeCookieStorage: function(){
            var date        =   new Date();
            var duration    =   Number(this.get('_storageDuration'));
            date.setTime(date.getTime()+duration);
            var obj     =   {};
            for(var e in this.attributes){
                if(e.indexOf("_")!==0){
                    var item    =   this.get(e);
                    if(item.toRecursiveJSON){
                        item    =   item.toRecursiveJSON();
                    }else if(item.toJSON){
                        item    =   item.toJSON();
                    }
                    obj[e]  =   item;
                }
            }
            var cookie  =   JSON.stringify(obj);
            var expire  =   date.toGMTString();
            document.cookie = this.get("_cookieName")+"="+cookie+"; expires="+expire+"; path=/";
        },
        registerChild:  function(child){
            if(!child){
                return;
            }
            if(_.isArray(child)){
                for(var i in child){
                    this.registerChild(child[i]);
                }
            }else if(this._children.indexOf(child)===-1){
                this._children.push(child);
                this._setupListeners(child);
            }
        },
        save: function(){
            if(window.localStorage){
                this._writeLocalStorage();
            }else{
                this._writeCookieStorage();
            }
        },
        fetch: function(){
            if(window.localStorage){
                this._readLocalStorage();
            }else{
                this._readCookieStorage();
            }
        },
        sync:   function(){
            this.save();
        },
        destroy: function(){}
    });
    
    return App;
});