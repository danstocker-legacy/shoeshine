/*global dessert, troop, sntls, evan, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Css Classes");

    test("Adding CSS class", function () {
        var cssClasses = shoeshine.CssClasses.create();

        strictEqual(cssClasses.addCssClass('foo'), cssClasses, "should be chainable");
        deepEqual(
            cssClasses.items,
            {
                foo: 'foo'
            },
            "should set CSS class"
        );
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
