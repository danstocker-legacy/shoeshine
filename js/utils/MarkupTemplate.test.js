/*global dessert, troop, sntls, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("MarkupTemplate", {
        setup: function () {
            shoeshine.MarkupTemplate.clearInstanceRegistry();
        },

        teardown: function () {
            shoeshine.MarkupTemplate.clearInstanceRegistry();
        }
    });

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
            template = shoeshine.MarkupTemplate.create(markup);

//        console.log(JSON.stringify(template.preprocessedTemplate.items, null, 2));
//        console.log(JSON.stringify(template.placeholderLookup.items, null, 2));

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello \">",
            "",
            "<bar class=\"   hi world    \">     hello   {{xxx}}",
            " ",
            "</bar>",
            " ",
            "</foo> "
        ], "should set preprocessed template contents");

        deepEqual(template.placeholderLookup.items, {
            "hello"    : 0,
            "undefined": 1,
            "hi"       : 2,
            "world"    : 2
        }, "should set placeholderLookup contents");

        strictEqual(shoeshine.MarkupTemplate.create(markup), template, "should be memoized");
    });

    test("Instantiation with empty template", function () {
        var template = shoeshine.MarkupTemplate.create('');

//        console.log(JSON.stringify(template.preprocessedTemplate.items, null, 2));
//        console.log(JSON.stringify(template.placeholderLookup.items, null, 2));

        deepEqual(template.preprocessedTemplate.items, [''], "should set preprocessed template contents");

        deepEqual(template.placeholderLookup.items, {
            undefined: 0
        }, "should set placeholderLookup contents");
    });

    test("Conversion from string", function () {
        var template = [
            //@formatter:off
                '<foo class="hello ">',
                    '<bar class="   hi world    ">     ',
                        'hello',
                        '   {{xxx}} ',
                    '</bar> ',
                '</foo> '
                //@formatter:on
        ].join('').toMarkupTemplate();

        ok(template.isA(shoeshine.MarkupTemplate), "should return a MarkupTemplate instance");

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello \">",
            "",
            "<bar class=\"   hi world    \">     hello   {{xxx}}",
            " ",
            "</bar>",
            " ",
            "</foo> "
        ], "should set preprocessed template contents");

        deepEqual(template.placeholderLookup.items, {
            "hello"    : 0,
            "undefined": 1,
            "hi"       : 2,
            "world"    : 2
        }, "should set placeholderLookup contents");
    });

    test("Conversion from string to placeholder", function () {
        equal('foo'.toPlaceholder(), '{{foo}}', "should envelope placeholder in handlebars");
    });

    test("Filling containers", function () {
        var markup = [
                //@formatter:off
                '<foo class="hello">',
                    '<bar class="hi world">',
                        'hello',
                    '</bar>',
                '</foo>'
                //@formatter:on
            ].join(''),
            template = markup.toMarkupTemplate();

        equal(
            template.fillContainers({
                hi   : "<baz />",
                world: '<span>Hello!</span>'
            }),
            '<foo class="hello"><bar class="hi world">hello<baz /><span>Hello!</span></bar></foo>',
            "should inject content into container as well as replace placeholder");
    });

    test("Filling empty template", function () {
        var template = ''.toMarkupTemplate();

        equal(
            template.fillContainers({
                foo: "Hello",
                bar: "World"
            }),
            "",
            "should return empty string");
    });
}());
