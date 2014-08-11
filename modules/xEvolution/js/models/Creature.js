define([
    "xEvolution/models/Entity/MoveableEntity"
],function(
    MoveableEntity
){
    var model    =   MoveableEntity.extend({
        _urlRoot:   "",
        defaults:   {
            borderColor:    "rgba(255,255,0,1)",
            borderWidth:    1,
            
            fillColor:      "rgba(0,0,0,1)",
        },
        initialize: function(properties,options){
            
        },
        
    });
    return model;
});