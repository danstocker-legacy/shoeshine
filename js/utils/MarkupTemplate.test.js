/*global dessert, troop, sntls, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("MarkupTemplate");

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
//        console.log(JSON.stringify(template.containerLookup.items, null, 2));

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello \">",
            "<bar class=\"   hi world    \">     hello   {{xxx}} ",
            "</bar> ",
            "</foo> "
        ], "should set preprocessed template contents");

        deepEqual(template.containerLookup.items, {
            "hello"    : 0,
            "hi"       : 1,
            "world"    : 1,
            "undefined": 2
        }, "should set containerLookup contents");
    });

    test("Instantiation with empty template", function () {
        var template = shoeshine.MarkupTemplate.create('');

//        console.log(JSON.stringify(template.preprocessedTemplate.items, null, 2));
//        console.log(JSON.stringify(template.containerLookup.items, null, 2));

        deepEqual(template.preprocessedTemplate.items, [''], "should set preprocessed template contents");

        deepEqual(template.containerLookup.items, {
            undefined: 0
        }, "should set containerLookup contents");
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
            "<bar class=\"   hi world    \">     hello   {{xxx}} ",
            "</bar> ",
            "</foo> "
        ], "should set preprocessed template contents");

        deepEqual(template.containerLookup.items, {
            "hello"    : 0,
            "hi"       : 1,
            "world"    : 1,
            "undefined": 2
        }, "should set containerLookup contents");
    });

    test("Conversion from string to placeholder", function () {
        equal('foo'.toPlaceholder(), '{{foo}}', "should envelope placeholder in handlebars");
    });

    test("Appending containers", function () {
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

        strictEqual(template.appendContainers({
            hi   : "<baz />",
            world: '<span>Hello!</span>'
        }), template, "should be chainable");

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello\">",
            "<bar class=\"hi world\">hello<baz /><span>Hello!</span>",
            "</bar>",
            "</foo>"
        ], "should alter preprocessed buffer");
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
            "<foo class=\"hello\">" +
            "<bar class=\"hi world\">hello<baz /><span>Hello!</span>" +
            "</bar>" +
            "</foo>",
            "should return filled & serialized template");

        deepEqual(template.preprocessedTemplate.items, [
            "<foo class=\"hello\">",
            "<bar class=\"hi world\">hello",
            "</bar>",
            "</foo>"
        ], "should leave template unaffected");
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

    test("Cloning", function () {
        var template = [
                //@formatter:off
                '<foo class="hello">',
                    '<bar class="hi world">',
                        'hello',
                    '</bar>',
                '</foo>'
                //@formatter:on
            ].join('').toMarkupTemplate(),
            clone = template.clone();

        ok(clone.instanceOf(shoeshine.MarkupTemplate), "should return MarkupTemplate instance");
        notStrictEqual(clone.preprocessedTemplate.items, template.preprocessedTemplate.items,
            "should create new preprocessedTemplate buffer");
        notStrictEqual(clone.containerLookup.items, template.containerLookup.items,
            "should create new containerLookup buffer");
        deepEqual(clone.preprocessedTemplate.items, template.preprocessedTemplate.items,
            "should copy preprocessedTemplate contents");
        deepEqual(clone.containerLookup.items, template.containerLookup.items,
            "should copy containerLookup contents");
    });

    test("Serialization", function () {
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
            template = markup.toMarkupTemplate();

        equal(template.toString(), markup, "should revert template to its string representation");
    });
}());
