/*global dessert, troop, sntls, e$, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Widget Collection");

    test("Conversion from array", function () {
        var items = [1, 2, 3],
            widgets = items.toWidgetCollection();

        ok(widgets.isA(shoeshine.WidgetCollection), "should return WidgetCollection instance");
        strictEqual(widgets.items, items, "should set items to widget array");
    });

    test("Conversion from Hash", function () {
        var items = [1, 2, 3],
            widgets = items.toWidgetCollection();

        ok(widgets.isA(shoeshine.WidgetCollection), "should return WidgetCollection instance");
        strictEqual(widgets.items, items, "should set items to widget array");
    });

    test("Serialization", function () {
        var widgets = [1, 2, 3].toWidgetCollection();
        equal(widgets.toString(), '123', "should concatenate items serialized");
    });
}());
