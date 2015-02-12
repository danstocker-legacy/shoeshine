/*global dessert, troop, sntls, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("HandlebarsTemplate");

    test("Instantiation", function () {
        var markup = [
                //@formatter:off
                '<foo class="hello ">',
                    '<bar class="   hi world    ">     ',
                        'hello',
                        '   {{xxx}} ',
                    '</bar> ',
                '</foo> '
                //@formatter:on
            ].join(''),
            template = shoeshine.HandlebarsTemplate.create(markup);

        equal(template.templateString, markup, "should set template string");
    });

    test("Conversion from string", function () {
        var template = 'foo bar'.toHandlebarsTemplate();

        ok(template.isA(shoeshine.HandlebarsTemplate), "should return a HandlebarsTemplate instance");
        equal(template.templateString, "foo bar", "should set template string");
    });

    test("Conversion from string to placeholder", function () {
        equal('foo'.toPlaceholder(), '{{foo}}', "should envelope placeholder in handlebars");
    });

    test("Filling multiple placeholders", function () {
        var template = "{{foo}} {{bar}}".toHandlebarsTemplate();

        equal(
            template.setContent({
                foo: "Hello",
                bar: "World"
            }),
            "Hello World",
            "should fill in all provided placeholders");

        equal(
            template.setContent({
                foo: "Hello"
            }),
            "Hello {{bar}}",
            "should preserve placeholders not specified");

        equal(
            template.setContent({
                foo: "Hello",
                bar: {}
            }),
            "Hello [object Object]",
            "should stringify object fill values");
    });

    test("Filling empty template", function () {
        var template = ''.toHandlebarsTemplate();

        equal(
            template.setContent({
                foo: "Hello",
                bar: "World"
            }),
            "",
            "should return empty string");
    });

    test("Clearing placeholders", function () {
        var template = "{{foo}}baz{{bar}}".toHandlebarsTemplate();
        equal(template.clearPlaceholders(), 'baz', "should remove all placeholders");
    });
}());
