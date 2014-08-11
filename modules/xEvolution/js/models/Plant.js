define([
    "xEvolution/models/Entity/HungerableEntity"
],function(
    HungerableEntity
){
    var model    =   HungerableEntity.extend({
        _urlRoot:   "",
        defaults:   {
            borderColor:    "rgba(128,255,0,1)",
            borderWidth:    1,
            
            fillColor:      "rgba(0,255,0,1)",
            
            maxHunger:      0,
            growTicks:      21,
        },
        initialize: function(properties,options){
            
        },
    });
    return model;
});