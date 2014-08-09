//  Spine View v0.1: Backbone Implementation

//  The Spine View is the main purpose behind Spine. The View uses more traditional inheritance by chaining
//  the initialization methods and calling them from parent class to child class. 
//  
//  All className, attribute, transition, and event properties are properly extended to incorporate css inheritance.
//  
//  The remove method is also extended, but in reverse order. The child remove method is called prior to the
//  parent class remove method and so on. This allows views to properly deconstruct prior to being removed from the DOM. 
//  
//  The power of Spine is the comprehensive event system around views. This allows event handlers rather than
//  overloading methods to be used in constructing and managing views.
//  
//  ===================================
//  Spine View Events:
//  ===================================
//  
//  initialize:complete -   Fired when the final child class has finished construction
//  
//  load:start          -   Fired when the system begins attempting to load an external template
//      -   At this time, the owning Spine App will also trigger load:start, indicating an external load in progress
//      
//  load:success        -   Fired when the system has successfully received an external template
//      -   At this time. the _template property is populated with the external HTML data
//      
//  load:error          -   Fired when the system was unable to load an external template
//  
//  load:complete       -   Fired when the system has finished preprocessing load listeners (success or fail)
//      -   At this time, the owning Spine App will also trigger load:complete, indicating an external load complete
//  
//  data:ready          -   Fired once all of the required data elements have verified their load
//  
//  render:start        -   Fired when the view begins to render the DOM elements
//  
//  render:compiled     -   Fired when the template has processed getViewData and rendered the elements
//  
//  render:empty        -   Fired when the view has no template with which to build additional elements
//  
//  render:complete     -   Fired when the view has completely finished rendering its DOM
//      -   At this time, the $el and el properties are populated with the DOM elements
//  
//  place:start         -   Fired when the view begins to be placed in the parent DOM
//  
//  place:complete      -   Fired when the view has completed being placed in the parent DOM
//  
//  place:error         -   Fired when the view experienced a problem placing into the parent DOM
//  
//  resize:start        -   Fired when the view recieves an indication that the window has resized
//  
//  resize:complete     -   Fired when all resize listeners have executed
//  
//  transition:start    -   Fired when the view begins a defined transition
//  
//  transition:step     -   Fired when the view completes a defined transitions progress
//  
//  transition:complete -   Fired when the view completes a defined transition
//  
//  remove:start        -   Fired when a call to remove the view from the DOM occurs
//  
//  remove:complete     -   Fired when the view has been completely removed from the DOM
//      -   At this time, the owning Spine App dereferences the view
//      
//  ===================================
//  Spine View "public" Methods
//  ===================================
//  
//  place(element,methodString)                     -   Begin placing the view into the element's DOM using the defined jQuery method: defaults to 'append'
//      -   element may either be a selector string, a jQuery selection, or DOM element
//      
//  remove()                                        -   Removes the view from the DOM and forces de-referencing
//  
//  ===================================
//  Spine View "protected" Methods
//  ===================================
//  
//  registerDataRequirement(SpineModel)             -   indicate the view may not render until the SpineModel has loaded data
//  
//  registerViewRequirement(transition,SpineView)   -   indicate the specified transition must wait for the SpineView to load prior to execution
//  
//  render()                                        -   Force the view to render or re-render the DOM elements
//      
//  isReady()                                       -   Returns true if all required views and models are finished proccessing
//  
//  getViewData()                                   -   Returns a JSON object to be passed into the render method when processing the template
//      -   This method is expected to be overloaded in child classes
//  
//  ===================================
//  Spine View "protected" properties
//  ===================================
//  
//  _app            -   (Object) This is a reference to the owning Spine App for configuration elements, etc...
//  
//  _templateUrl    -   (String | Function) This is the path to the external template, for purely generated elements, leave "falsy"
//  
//  _templateMethod -   (Function) This is the method used for template processing: defaults to _.template
//  
//  events          -   (Object) This operates the same as the Backbone event object except it will inherit parent class events
//  
//  className       -   (String) This operates the same as the Backbone className property except it will inherit parent class classNames
//  
//  attributes      -   (Object) This operates the same as the Backbone attribute object except it will inherit parent class attributes
//  
//  

define([
    "jquery",
    "underscore.extendr",
    "backbone.spine"
],function(
    $,
    _,
    Backbone
){
    var SpineView    =   Backbone.View.extend({
        _app:                   null,
        _rendered:              false,
        _loaded:                false,
        _loading:               false,
        _placed:                false,
        _placing:               false,
        _templateUrl:           "",
        _template:              null,
        _templateMethod:        _.template,
        _placementReference:    null,
        _placementMethod:       'append',
        _dataQueue:             null,
        _transitionQueue:       null,
        events:         {
            'transition:step': 'transition'
        },
        initialize: function(options){
            if(!this._app){
                throw new Error("Unable to initialize view: Missing application");
            }
            
            this._app.registerChild(this);

            this._initializeTransitionQueue();
            this._initializeDataQueue();

            this.on('place:complete',this._forceRefresh);
            this.listenTo(this._app,'resize',this._triggerResize);

         },
        _initializeTransitionQueue: function(){
            if(!this._transitionQueue){
                this._transitionQueue   =   {
                    waitQueue:      {},
                    processQueue:   []
                };
                for(var transition in this.transitions){
                    this._transitionQueue[transition]   =   this.transitions[transition];
                }
            }
        },
        _initializeDataQueue:   function(){
            if(!this._dataQueue){
                this._dataQueue =   [];
            }
        },
        _loadTemplate: function(){
            this._loaded    =   false;
            this._loading   =   true;
            this.trigger('load:start',this);
            $.ajax({
                url:        this._getTemplateUrl(),
                context:    this,
                dataType:   'text',
                success:    this._templateLoadSuccess,
                error:      this._templateLoadError,
                complete:   this._templateLoadComplete
            });
        },
        _templateLoadSuccess: function(html){
            this._loading    =   false;
            this._template   =   html;
            this._loaded     =   true;
            this.trigger('load:success',this);
        },
        _templateLoadError: function(){
            this._loading   =   false;
            this.trigger('load:error');
        },
        _templateLoadComplete: function(xHR,status){
            if(["success","notmodified"].indexOf(status)!=-1){
                this._loaded    =   true;
            }
            this.trigger('load:complete',this);
        },
        _triggerResize: function(){
            this.trigger('resize:start',this);
            this.trigger('resize:complete',this);
        },
        _getTemplateUrl: function(){
            var baseUrl =   this._app.get('_templateRootUrl') || "";
            if(typeof this._templateUrl=="function"){
                return baseUrl+this._templateUrl();
            }else{
                return baseUrl+this._templateUrl;
            }
        },
        _dataCheckIn: function(modelObj){
            if(this.isReady()){
                this.trigger('data:ready',this);
            }
        },
        _forceRefresh: function(){
            var oh  =   this.el.offsetHeight;
        },
        _processTransitionQueue: function(){
            for(var i in this._transitionQueue.processQueue){
                var queue   =   this._transitionQueue.processQueue[i];
                if(queue.obj._placed){
                    this._transitionQueue.processQueue.splice(i,1);
                    this._transition(queue.type,queue.stage);
                }
            }
        },
        _transition: function(){
            var event   =   (typeof arguments[0]=="object") ? arguments[0] : null;
            var type    =   (typeof arguments[0])=="string" ? arguments[0] : arguments[1];
            var stage   =   ((typeof arguments[0])=="string" ? arguments[1] : arguments[2]) || 0;
            if(event){
                event.stopImmediatePropagation();
                event.preventDefault();
            }
            this.$el.off('transitionend webkitTransitionEnd oTransitionEnd');

            if(!type){
                return;
            }
            try{
                var wait    =   false;
                for(var i in this._transitionQueue.waitQueue[type]){
                    var qObj    =   this._transitionQueue.waitQueue[type][i];
                    if(!qObj._placed){
                        this._transitionQueue.processQueue.push({
                            obj:    qObj,
                            type:   type,
                            stage:  stage
                        });
                        this.listenToOnce(qObj,'place:complete',this._processTransitionQueue);
                        wait    =   true;
                    }
                }
                if(wait){
                    return;
                }
            }catch(ex){}
            stage++;

            if(!this._transitionQueue[type] || this._transitionQueue[type][stage-1]){
                this.trigger('transition:complete',type);
                return;
            }

            this.trigger('transition:step',type);
            this._forceRefresh();
            this.$el.on('transitionend webkitTransitionEnd oTransitionEnd',function(event){
                event.stopImmediatePropagation();
                event.preventDefault();
                $(this).trigger('transition:step',[type,stage]);
            });

            this._transitionQueue[type][stage-1].call(this);        
        },
        isReady: function(){
            for(var i=0;i<this._dataQueue.length;i++){
                if(!this._dataQueue[i].isReady()){
                    return false;
                }
            }
            return true;
        },
        render:         function(){
            this._rendered  =   false;
            if(this._templateUrl && !this._loaded && !this._loading){
                this.once('load:complete',this.render);
                this._loadTemplate();
                return this;
            }

            if(!this.isReady()){
                this.once('data:ready',this.render);
                return this;
            }

            if(!this._loading){
                this.trigger('render:start');

                if(this._templateUrl && this._template){
                    this.$el.html(this._templateMethod(this._template,this.getViewData()));
                    this.trigger('render:compiled');

                }

                if(!this._templateUrl && !this._template){
                    this.trigger('render:empty');
                }

                this._rendered  =   true;
                this.trigger('render:complete');
                return this;
            }

            return this;
        },

        place:      function(el,method){
            if(this._placed){
                return this;
            }

            this._placementReference    =   el && !(el instanceof Backbone.View) ?   el      :   this._placementReference;
            this._placementMethod       =   method && (typeof method)=="string"  ?   method  :   this._placementMethod;
            var errors                  =   [];

            if(this._loading){
                if(!this._placing){
                    this._placing   =   true;
                    this.once('render:complete',this.place);
                }
                return this;
            }

            this._placing   =   true;

            if(!this._rendered){
                this.once('render:complete',this.place);
                this.render();
                return this;
            }

            if(this._rendered && this._placementReference && $(this._placementReference)[this._placementMethod]){
                this.trigger('place:start',this);
                $(this._placementReference)[this._placementMethod](this.$el);
                this._placed    =   true;
                this._placing   =   false;
                this.trigger('place:complete',this);
                return this;
            }

            if(!this._placementReference){
                errors.push("Missing destination element!");
            }
            if(!$(this._placementReference).length){
                errors.push("Invalid destination element!");
            }
            if(!$(this._placementReference)[this._placementMethod]){
                errors.push("Unsupported placement method: "+this._placementMethod+"!");
            }

            if(errors.length){
                this.trigger('place:error',errors);

                throw new Error(errors.join("\n"));
            }

            return this;
        },
        remove: function(){
            this._placed    =   false;
            this._rendered  =   false;
            this.$el.remove();
            this.stopListening();
        },
        registerDataRequirement: function(modelObj){        
            if(_.isArray(modelObj)){
                for(var i=0;i<modelObj.length;i++){
                    this.registerDataRequirement(modelObj[i]);
                }
            }else{
                this._dataQueue.push(modelObj);
                if(!modelObj.isReady()){
                    this.listenToOnce(modelObj,'data:ready',this._dataCheckIn);
                }
            }
        },
        registerViewRequirement: function(transition,viewObj){
            if(typeof transition==="string" && viewObj){
                this._transitionQueue.waitQueue[transition] =   this._transitionQueue.waitQueue[transition] || [];
                this._transitionQueue.waitQueue[transition].push(viewObj);
            }
        },

        getViewData: function(){return {};}
    });
    return SpineView;
});