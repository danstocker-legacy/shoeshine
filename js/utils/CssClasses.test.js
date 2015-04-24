/*global dessert, troop, sntls, evan, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Css Classes");

    test("Adding CSS class", function () {
        var cssClasses = shoeshine.CssClasses.create();

        strictEqual(cssClasses.addCssClass('foo'), cssClasses, "should be chainable");
        deepEqual(cssClasses.items, {
            foo: 1
        }, "should set 1 as ref count on first use");

        cssClasses.addCssClass('foo');
        deepEqual(cssClasses.items, {
            foo: 2
        }, "should increase ref count on subsequent calls");
    });

    test("Decreasing ref count CSS class", function () {
        var cssClasses = shoeshine.CssClasses.create()
            .addCssClass('foo')
            .addCssClass('foo');

        strictEqual(cssClasses.decreaseRefCount('foo'), cssClasses, "should be chainable");
        deepEqual(cssClasses.items, {
            foo: 1
        }, "should decrease reference count when higher than 1");

        cssClasses.decreaseRefCount('foo');
        deepEqual(cssClasses.items, {}, "should remove CSS class when ref count is 1 or lower");
    });

    test("Removing CSS class", function () {
        var cssClasses = shoeshine.CssClasses.create()
            .addCssClass('foo');

        strictEqual(cssClasses.removeCssClass('foo'), cssClasses, "should be chainable");
        deepEqual(cssClasses.items, {}, "should remove CSS class");
    });

    test("Serialization", function () {
        var cssClasses = shoeshine.CssClasses.create()
            .addCssClass('foo')
            .addCssClass('bar');

        equal(cssClasses.toString(), 'bar foo', "should return space-separated CSS class list");
    });
}());
