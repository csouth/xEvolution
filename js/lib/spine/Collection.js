define([
    "backbone"
],function(
    Backbone
){
    var BaseCollection  =   Backbone.Collection.extend({
        _app:               null,
        _dataRequirements:  [],
        initialize: function(props,options){
            if(!this._app){
                throw new Error("Unable to initialize collection: Missing application");
            }
            
            this._app.registerChild(this);
            this.on('reset',this._setLoadedChildren);
        },
        url: function(){
            if(this._urlRoot){
                return this._config.get('_apiRootUrl')+this._urlRoot;
            }
            return null;
        },
        _setLoadedChildren: function(){
            for(var i in this.models){
                this.models[i].updateFetch();
            }
        },
        _dataCheckIn: function(){
            if(this.isReady()){
                this.trigger('data:ready');
            }
        },
        _removeModel: function(model){
            this.remove(model);
        },
        isReady: function(){
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
        getInstance:    function(id){
            var requestModel   =   this.get(id);
            if(!requestModel){
                requestModel   =   new this.model({"id":id});
                this.add(requestModel);
                this.listenToOnce(requestModel,'error',this._removeModel);
                requestModel.fetch();
            }
            return requestModel;
        },
        
        toRecursiveJSON: function(){
            var json    =   [];
            for(var e in this.models){
                if(this.get(e).toRecursiveJSON){
                    json.push(this.get(e).toRecursiveJSON());
                }else if(this.get(e).toJSON){
                    json.push(this.get(e).toJSON());
                }else{
                    json.push(this.get(e));
                }
            }
            return json;
        }
    });
    return BaseCollection;
});