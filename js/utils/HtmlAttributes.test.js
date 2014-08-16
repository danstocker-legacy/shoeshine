/*global dessert, troop, sntls, evan, s$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    var htmlAttributes;

    module("Html Attributes", {
        setup: function () {
            htmlAttributes = s$.HtmlAttributes.create();
        }
    });

    test("Instantiation", function () {
        ok(htmlAttributes.hasOwnProperty('idAttribute'), "should add idAttribute property");
        equal(typeof htmlAttributes.idAttribute, 'undefined', "should set idAttribute property to undefined");
        ok(htmlAttributes.cssClasses.isA(sntls.Collection), "should set cssClasses property");
        equal(htmlAttributes.cssClasses.getKeyCount(), 0, "should set cssClasses collection to empty");
        ok(htmlAttributes.inlineStyles.isA(sntls.Collection), "should set inlineStyles property");
        equal(htmlAttributes.inlineStyles.getKeyCount(), 0, "should set inlineStyles collection to empty");
    });

    test("ID attribute setter", function () {
        raises(function () {
            htmlAttributes.setIdAttribute();
        }, "should raise exception on missing arguments");

        strictEqual(htmlAttributes.setIdAttribute("foo"), htmlAttributes, "should be chainable");

        equal(htmlAttributes.idAttribute, 'foo', "should set ID attribute");
    });

    test("Adding CSS class", function () {
        expect(2);

        s$.CssClasses.addMocks({
            addCssClass: function (cssClass) {
                equal(cssClass, 'foo', "should add class to collection");
            }
        });

        strictEqual(htmlAttributes.addCssClass('foo'), htmlAttributes, "should be chainable");

        s$.CssClasses.removeMocks();
    });

    test("Removing CSS class", function () {
        expect(2);

        s$.CssClasses.addMocks({
            removeCssClass: function (cssClass) {
                equal(cssClass, 'foo', "should remove class from collection");
            }
        });

        strictEqual(htmlAttributes.removeCssClass('foo'), htmlAttributes, "should be chainable");

        s$.CssClasses.removeMocks();
    });

    test("Adding inline style", function () {
        expect(3);

        s$.InlineStyles.addMocks({
            setItem: function (styleName, styleValue) {
                equal(styleName, 'foo', "should pass style name to addition");
                equal(styleValue, 'bar', "should pass style value to addition");
            }
        });

        strictEqual(htmlAttributes.addInlineStyle('foo', 'bar'), htmlAttributes, "should be chainable");

        s$.InlineStyles.removeMocks();
    });

    test("Removing inline style", function () {
        expect(2);

        s$.InlineStyles.addMocks({
            deleteItem: function (styleName) {
                equal(styleName, 'foo', "should pass style name to removal");
            }
        });

        strictEqual(htmlAttributes.removeInlineStyle('foo'), htmlAttributes, "should be chainable");

        s$.InlineStyles.removeMocks();
    });

    test("Final attribute list getter", function () {
        htmlAttributes
            .setItem('id', "fakeId")
            .setItem('class', "fakeClasses")
            .setItem('style', "fakeStyle")
            .setItem('bar', 'baz');

        htmlAttributes.setIdAttribute('foo');
        htmlAttributes.cssClasses
            .addCssClass('hello')
            .addCssClass('world');
        htmlAttributes.inlineStyles
            .setItem('border', 'black')
            .setItem('background', 'white');

        var finalAttributes = htmlAttributes.getFinalAttributes();

        ok(finalAttributes.isA(s$.HtmlAttributes), "should return an HtmlAttributes instance");
        notStrictEqual(finalAttributes, htmlAttributes, "should return a different HtmlAttributes instance");

        deepEqual(
            finalAttributes.items,
            {
                id: 'foo',
                style: htmlAttributes.inlineStyles.toString(),
                class: htmlAttributes.cssClasses.toString(),
                bar: 'baz'
            },
            "should set attributes according to collections and ID attribute"
        );
    });

    test("Serialization", function () {
        expect(2);

        htmlAttributes.addMocks({
            getFinalAttributes: function () {
                ok(true, "should get final attribute list");
                return s$.HtmlAttributes.create({
                    foo: 'bar',
                    hello: 'world'
                });
            }
        });

        equal(htmlAttributes.toString(), 'foo="bar" hello="world"', "should contents in HTML attribute list format");
    });
}());
