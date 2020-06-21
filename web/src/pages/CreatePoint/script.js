
var behavior = function (val) {

    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
},

options = {

    onKeyPress: function (val, e, field, options) {
        
        field.mask(behavior.apply({}, arguments), options);
    }
};

$('.phone').mask(behavior, options);