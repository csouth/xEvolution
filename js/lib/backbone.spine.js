//  Spine v0.1: Backbone Extension

//  Spine extends the default functionality of Backbone by implementing additional
//  object inheritance. The full library includes base implementation of Backbone
//  Views, Models, Collections, and Routers. These base implementations include
//  a comprehensive event system and apply boiler plate functionality to simplify
//  extending objects.
//

(function(){
    var extendView  =   function(View){
        var viewExtend  =   View.extend;
        View.extend    =   function(protoProps,staticProps){
            /*
             * Extending initialization
             * Order from parent to child
             */
           var initQueue   =   this.prototype._initQueue ? this.prototype._initQueue.concat() : [];
           if(!this.prototype._initQueue && this.prototype.initialize){
               initQueue.push(this.prototype.initialize);
           }
           if(protoProps.initialize){
               initQueue.push(protoProps.initialize);
           }
           protoProps._initQueue   =   initQueue;
           protoProps.initialize   =   function(){
               for(var initIndex in this._initQueue){
                   this._initQueue[initIndex].apply(this,arguments);
               }
               this.trigger('initialize:complete',this);
           };

           /*
            * Extending removal
            * Order from child to parent
            */
           var removeQueue         =   this.prototype._removeQueue ? this.prototype._removeQueue.concat() : [];
           if(!this.prototype._removeQueue && this.prototype.remove){
               removeQueue.push(this.prototype.remove);
           }
           if(protoProps.remove){
               removeQueue.push(protoProps.remove);
           }
           protoProps._removeQueue =   removeQueue.reverse();
           protoProps.remove       =   function(){
               this.trigger('remove:start',this);
               for(var removeIndex in this._removeQueue){
                   this._removeQueue[removeIndex].apply(this,arguments);
               }
               this.trigger('remove:complete',this);
           };

           var pT                  =   this.prototype.transitions || {};
           var cT                  =   protoProps.transitions || {};
           protoProps.transitions  =   _.extendr(pT,cT);

           /*
            * Extending attributes
            */
           var pA                  =   this.prototype.attributes || {};
           var cA                  =   protoProps.attributes || {};
           protoProps.attributes   =   _.extend({},pA,cA);

           /*
            * Extending class names
            */
           var pC                  =   this.prototype.className || "";
           var cC                  =   protoProps.className || "";
           protoProps.className    =   (pC+" "+cC).trim();

           /*
            * Extending events
            */
           var pE                  =   this.prototype.events;
           var cE                  =   protoProps.events;
           protoProps.events       =   _.extend({},pE,cE);

           var extended    =   viewExtend.call(this, protoProps, staticProps);

           return extended;
        };
    };
    
    var extendModel =   function(Model){
        var modelExtend =   Model.extend;
        Model.extend   =   function(protoProps, staticProps){
            /*
             * Extending initialization
             * Order from parent to child
             */
            var initQueue   =   this.prototype._initQueue ? this.prototype._initQueue.concat() : [];
            if(!this.prototype._initQueue && this.prototype.initialize){
                initQueue.push(this.prototype.initialize);
            }
            if(protoProps.initialize){
                initQueue.push(protoProps.initialize);
            }
            protoProps._initQueue   =   initQueue;
            protoProps.initialize   =   function(){
                for(var initIndex in this._initQueue){
                    this._initQueue[initIndex].apply(this,arguments);
                }
                this.trigger('initialize:complete',this);
            };

            /*
             * Extending defaults
             */
            var pD                  =   this.prototype.defaults;
            var cD                  =   protoProps.defaults;
            protoProps.defaults     =   _.extend({},pD,cD);

            var extended    =   modelExtend.call(this, protoProps, staticProps);

            return extended;
        };
    };
    
    var extendCollection    =   function(Collection){
        var collectionExtend        =   Collection.extend;
        Collection.extend  =   function(protoProps, staticProps){
            /*
             * Extending initialization
             * Order from parent to child
             */
            var initQueue   =   this.prototype._initQueue ? this.prototype._initQueue.concat() : [];
            if(!this.prototype._initQueue && this.prototype.initialize){
                initQueue.push(this.prototype.initialize);
            }
            if(protoProps.initialize){
                initQueue.push(protoProps.initialize);
            }
            protoProps._initQueue   =   initQueue;
            protoProps.initialize   =   function(){
                for(var initIndex in this._initQueue){
                    this._initQueue[initIndex].apply(this,arguments);
                }
                this.trigger('initialize:complete',this);
            };

            var extended    =   collectionExtend.call(this, protoProps, staticProps);

            return extended;
        };
    };
    
    var extendRouter    =   function(Router){
        var routerExtend        =   Router.extend;
        Router.extend  =   function(protoProps,staticProps){
            /*
             * Extending initialization
             * Order from parent to child
             */
            var initQueue   =   this.prototype._initQueue ? this.prototype._initQueue.concat() : [];
            if(!this.prototype._initQueue && this.prototype.initialize){
                initQueue.push(this.prototype.initialize);
            }
            if(protoProps.initialize){
                initQueue.push(protoProps.initialize);
            }
            protoProps._initQueue   =   initQueue;
            protoProps.initialize   =   function(){
                for(var initIndex in this._initQueue){
                    this._initQueue[initIndex].apply(this,arguments);
                }
                this.trigger('initialize:complete',this);
            };

            var extended    =   routerExtend.call(this, protoProps, staticProps);

            return extended;
        };
    };
    
    if(typeof define==="function"){
        define(['backbone','underscore.extendr'],function(Backbone){
            extendView(Backbone.View);
            extendModel(Backbone.Model);
            extendCollection(Backbone.Collection);
            extendRouter(Backbone.Router);
            
            return Backbone;
        });
    }else if(typeof Backbone==="object" && typeof _==="function" && typeof _.extendr==="function"){
        extendView(Backbone.View);
        extendModel(Backbone.Model);
        extendCollection(Backbone.Collection);
        extendRouter(Backbone.Router);
    }
})();