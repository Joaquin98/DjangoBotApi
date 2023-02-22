/* global us , Game*/
/**
 * extend underscore (us) with a 'implements' method.
 * This method throws (only in dev mode), whenever target_class does
 * not implement a method from interface_object.
 *
 * usage:
 *
 * MyClass = {
 *	method1 : function() {}
 * }
 *
 * Interface = {
 *  method1 : function() {},
 *  method2 : function() {}
 * }
 *
 * us.implements(MyClass, Interface);		// throws: misc/interface: method2 not defined in MyClass
 *
 */
define('misc/interface', function() {

    var interface_function = function(target_class, interface_object) {
        if (!interface_object) {
            if (Game.dev) {
                console.trace();
                throw 'misc/interface: argument 2 of implements may not be falsy';
            }
        }
        us.each(interface_object, function(method) {
            if (typeof target_class[method] === 'undefined') {
                if (Game.dev) {
                    console.trace();
                    throw 'misc/interface: ' + method + ' not defined on ' + target_class;
                }
            }
            if (typeof target_class[method] !== 'function') {
                if (Game.dev) {
                    console.trace();
                    throw 'misc/interface: ' + method + ' not not a function in ' + target_class;
                }
            }
        });
    };

    us.implements = interface_function;
});