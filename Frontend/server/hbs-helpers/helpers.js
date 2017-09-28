var Handlebars = require('handlebars'),
    merge = require('mixin-deep');

var helpers = {

    include: function(name, options) {
        
        if (arguments.length < 2) {
            throw new Error("Handlebars Helper 'include' error, nothing to include");
        }

        var partial = options.data.exphbs.partials[name];
        var ctx = { label: 'hooray' };
        //console.log(merge(this, ctx));

        console.log(new Handlebars.SafeString(partial(options)));

        //console.log(partial(context));

        // var registeredPartials = options.data.exphbs.partials;
        // if (typeof registeredPartials[partial] !== 'undefined') {
        //     var template = expr.compile(registeredPartials[partial](), 'utf8');
        //     return template(options);
        // } else {
        //     return options.fn(this);
        // }
        //return partial;
    },

    compare: function(lvalue, operator, rvalue, options) {

        var operators, result;
        
        if (arguments.length < 3) {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }
        
        if (options === undefined) {
            options = rvalue;
            rvalue = operator;
            operator = "===";
        }
        
        operators = {
            '==': function (l, r) { return l == r; },
            '===': function (l, r) { return l === r; },
            '!=': function (l, r) { return l != r; },
            '!==': function (l, r) { return l !== r; },
            '<': function (l, r) { return l < r; },
            '>': function (l, r) { return l > r; },
            '<=': function (l, r) { return l <= r; },
            '>=': function (l, r) { return l >= r; },
            'typeof': function (l, r) { return typeof l == r; }
        };
        
        if (!operators[operator]) {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }
        
        result = operators[operator](lvalue, rvalue);
        
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },

    replace: function(string, to_replace, replacement) {
        return (string || '').replace(to_replace, replacement);
    },

    object: function(obj) {
        var ret = {};
        Object.keys(obj.hash).reverse().forEach(function(key) {
            ret[key] = obj.hash[key];
        });
        return ret;
    }

};

module.exports = helpers;