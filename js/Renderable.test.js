/*global dessert, troop, sntls, s$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Renderable");

    /**
     * @class
     * @extends troop.Base
     * @extends shoeshine.Renderable
     */
    var Renderable = troop.Base.extend()
        .addTrait(s$.Renderable)
        .addMethods({
            init: function () {
                s$.Renderable.init.apply(this, arguments);
            }
        });

    test("Instantiation", function () {
        var htmlAttributes = s$.HtmlAttributes.create({foo: 'bar'}),
            instance = Renderable.create(htmlAttributes);

        equal(instance.htmlTag, 'div', "should set HTML tag to 'div'");
        ok(instance.htmlAttributes.isA(s$.HtmlAttributes), "should add HTML attribute collection");
        strictEqual(instance.htmlAttributes, htmlAttributes, "should set HTML attribute");
    });

    test("Html tag setter", function () {
        var instance = Renderable.create();

        strictEqual(instance.setHtmlTag('foo'), instance, "should be chainable");
        equal(instance.htmlTag, 'foo', "should set HTML tag");
    });

    test("Element creation", function () {
        expect(8);

        var instance = Renderable.create()
                .setHtmlTag('customTag'),
            instanceElement = {};

        instance.addMocks({
            _createElementProxy: function (tagName) {
                equal(tagName, 'customTag', "should create element");
                return instanceElement;
            },

            _attributeSetterProxy: function (element, attributeName, attributeValue) {
                strictEqual(element, instanceElement, "should set attribute on element");
                equal(attributeName, 'foo', "should pass attribute name to attribute setter");
                equal(attributeValue, 'bar', "should pass attribute value to attribute setter");
            },

            contentMarkup: function () {
                return 'hello world{{placeholder}}';
            },

            _innerHtmlSetterProxy: function (element, innerHtml) {
                strictEqual(element, instanceElement, "should set innerHTML on element");
                equal(innerHtml, 'hello world',
                    "should pass content markup to innerHTML setter stripped of placeholders");
            }
        });

        instance.htmlAttributes.addMocks({
            getFinalAttributes: function () {
                ok(true, "should fetch final HTML attributes");
                return s$.HtmlAttributes.create({foo: 'bar'});
            }
        });

        strictEqual(instance.createElement(), instanceElement, "should return created element");
    });

    test("Element getter", function () {
        expect(2);

        var instance = Renderable.create(s$.HtmlAttributes.create().setIdAttribute('hello')),
            instanceElement = {};

        instance.addMocks({
            _getElementByIdProxy: function (elementId) {
                equal(elementId, 'hello', "should get element from DOM by ID");
                return instanceElement;
            }
        });

        strictEqual(instance.getElement(), instanceElement, "should return matching element from DOM");
    });

    test("Rendering into element", function () {
        expect(4);

        var instance = Renderable.create(),
            instanceElement = {},
            targetElement = {};

        instance.addMocks({
            createElement: function () {
                ok(true, "should create instance element");
                return instanceElement;
            },

            _appendChildProxy: function (parentElement, childElement) {
                strictEqual(parentElement, targetElement, "should append to target element");
                strictEqual(childElement, instanceElement, "should append instance element");
            }
        });

        strictEqual(instance.renderInto(targetElement), instance, "should be chainable");
    });

    test("Rendering before element", function () {
        expect(5);

        var instance = Renderable.create(),
            instanceElement = {},
            targetElement = {
                parentNode: {}
            };

        instance.addMocks({
            createElement: function () {
                ok(true, "should create instance element");
                return instanceElement;
            },

            _insertBeforeProxy: function (parentElement, afterElement, element) {
                strictEqual(parentElement, targetElement.parentNode, "should pass target's parent element");
                strictEqual(afterElement, targetElement, "should pass target element");
                strictEqual(element, instanceElement, "should insert instance element before target");
            }
        });

        strictEqual(instance.renderBefore(targetElement), instance, "should be chainable");
    });

    test("Re-rendering", function () {
        expect(7);

        var instance = Renderable.create(),
            currentElement = {
                parentNode: {}
            },
            newElement = {};

        instance.addMocks({
            getElement: function () {
                ok(true, "should fetch current DOM element");
                return currentElement;
            },

            createElement: function () {
                ok(true, "should create a new element");
                return newElement;
            },

            _replaceChildProxy: function (parentElement, afterElement, beforeElement) {
                ok(true, "should replace current element w/ new");
                strictEqual(parentElement, currentElement.parentNode,
                    "should pass current element's parent as parent element");
                strictEqual(afterElement, newElement, "should pass new element parent");
                strictEqual(beforeElement, currentElement, "should pass current element");
            }
        });

        strictEqual(instance.reRender(), instance, "should be chainable");
    });
}());
