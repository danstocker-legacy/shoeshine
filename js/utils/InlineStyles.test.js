/*global dessert, troop, sntls, evan, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Inline Styles");

    test("Serialization", function () {
        var inlineStyles = shoeshine.InlineStyles.create()
            .setItem('foo', 'bar')
            .setItem('hello', 'world');

        equal(inlineStyles.toString(), 'foo: bar; hello: world',
            "should return semicolon-separated style key-value pairs");
    });
}());
