define([
    "backbone.spine"
],function(
    Backbone
){
   var Model    =    Backbone.Model.extend({
        _app:                   null,
        _dataRequirements:      [],
        _loaded:                false,
        initialize: function(props,options){            
            if(!this._app){
                throw new Error("Unable to initialize model: Missing application");
            }
            
            this._app.registerChild(this);
            this.on('sync',this.updateFetch);
            
        },
        urlRoot: function(){
            if(this._urlRoot){
                return this._app.get('_apiRootUrl')+this._urlRoot;
            }
            return null;
        },
        updateFetch: function(){
            this._loaded    =   true;
            this._dataCheckIn();
        },
        _dataCheckIn: function(){
            if(this.isReady()){
                this.trigger('data:ready');
            }
        },
        isReady: function(){
            if(!this._loaded){
                return false;
            }
            for(var i=0;i<this._dataRequirements.length;i++){
                if(!this._dataRequirements[i].isReady()){
                    return false;
                }
            }
            return true;
        },
        registerDataRequirement: function(dataModel){
            if(!_.isArray(this._dataRequirements)){
                this._dataRequirements  =   [];
            }
            if(_.isArray(dataModel)){
                for(var i=0;i<dataModel.length;i++){
                    this.registerDataRequirement(dataModel[i]);
                }
            }else{
                this._dataRequirements.push(dataModel);
                if(!dataModel.isReady()){
                    this.listenToOnce(dataModel,'data:ready',this._dataCheckIn);
                }
            }
        },        
        toRecursiveJSON: function(){
            var json    =   this.toJSON();
            for(var e in this.attributes){
                if(this.get(e).toRecursiveJSON){
                    json[e] =   this.get(e).toRecursiveJSON();
                }else{
                    if(this.get(e).toJSON){
                        json[e]  =   this.get(e).toJSON();
                    }
                }
            }
            return json;
        }
    });
    
    return Model;
});