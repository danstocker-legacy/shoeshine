/*global dessert, troop, sntls, e$, shoeshine, Event */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Widget");

    test("Extension", function () {
        var CustomWidget = shoeshine.Widget.extend('CustomWidget');

        ok(CustomWidget.isA(shoeshine.Widget), "should return Widget subclass");
        strictEqual(CustomWidget.getBase(), shoeshine.Widget, "should extend base class");
        notStrictEqual(CustomWidget.htmlAttributes, shoeshine.Widget.htmlAttributes,
            "should clone html attribute collection");
        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add class name to CSS class collection");
    });

    test("Trait addition", function () {
        var CustomWidget = shoeshine.Widget.extend('CustomWidget')
            .addTrait(e$.Evented, 'Evented');

        ok(!!CustomWidget.htmlAttributes.cssClasses.getItem('CustomWidget'),
            "should add trait name to CSS class collection");
    });

    test("Instantiation", function () {
        expect(9);

        shoeshine.Renderable.addMocks({
            init: function (htmlAttributes) {
                ok(true, "should initialize Renderable trait");
                ok(htmlAttributes.isA(shoeshine.HtmlAttributes), "should pass HtmlAttributes instance");
                ok(htmlAttributes.idAttribute, 'w0', "should set ID attribute");
            }
        });

        shoeshine.Widget.addMocks({
            setChildName: function (childName) {
                equal(childName, this.instanceId.toWidgetId(), "should set widget ID as child name");
            }
        });

        var widget = shoeshine.Widget.create();

        shoeshine.Renderable.removeMocks();
        shoeshine.Widget.removeMocks();

        ok(widget.hasOwnProperty('containerCssClass'), "should add containerCssClass property");
        equal(typeof widget.containerCssClass, 'undefined', "should set containerCssClass to undefined");

        ok(widget.children.isA(shoeshine.WidgetCollection), "should convert children to WidgetCollection");

        ok(widget.eventPath.isA(sntls.Path), "should set eventPath property");
        ok(widget.eventPath.equals(widget.getLineage().prepend(widget.DETACHED_EVENT_PATH_ROOT)),
            "should set eventPath to lineage path");
    });

    test("Conversion from string", function () {
        expect(2);

        var widget = {};

        sntls.Managed.addMocks({
            getInstanceById: function (instanceId) {
                equal(instanceId, 14, "should fetch instance from registry");
                return widget;
            }
        });

        strictEqual('w14'.toWidget(), widget, "should return instance fetched by getInstanceId");

        sntls.Managed.removeMocks();
    });

    test("Conversion from Element", function () {
        if (document) {
            expect(2);

            var element = document.createElement('div'),
                widget = {};

            element.id = 'w100';

            sntls.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(element.toWidget(), widget, "should fetch widget by instance ID");

            sntls.Managed.removeMocks();
        }
    });

    test("Conversion from Event", function () {
        if (Event) {
            expect(3);

            var uiEvent = document.createEvent('MouseEvent'),
                widget = {};

            shoeshine.WidgetUtils.addMocks({
                getParentNodeByClassName: function (childElement, cssClassName) {
                    equal(cssClassName, 'foo', "should fetch nearest widget parent element");
                    return {
                        id: 'w100'
                    };
                }
            });

            sntls.Managed.addMocks({
                getInstanceById: function (instanceId) {
                    equal(instanceId, 100, "should fetch instance from registry");
                    return widget;
                }
            });

            strictEqual(uiEvent.toWidget('foo'), widget, "should return instance fetched by getInstanceId");

            shoeshine.WidgetUtils.removeMocks();
            sntls.Managed.removeMocks();
        }
    });

    test("Container setter", function () {
        var widget = shoeshine.Widget.create();

        strictEqual(widget.setContainerCssClass('foo'), widget, "should be chainable");
        equal(widget.containerCssClass, 'foo', "should set container CSS class");
    });

    test("Adding to parent", function () {
        expect(10);

        var childWidget = shoeshine.Widget.create(),
            parentWidget = shoeshine.Widget.create();

        raises(function () {
            childWidget.addToParent();
        }, "should raise exception on no arguments");

        raises(function () {
            childWidget.addToParent('foo');
        }, "should raise exception on invalid arguments");

        parentWidget.addMocks({
            triggerSync: function (eventName, payload) {
                equal(eventName, this.EVENT_CHILD_ADD, "should trigger addition event");
                strictEqual(payload.childWidget, childWidget, "should pass child widget in payload");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                ok(true, "should determine whether widget is attached to root");
                return true;
            },

            afterAdd: function () {
                ok(true, "should call afterAdd");
            },

            _renderIntoParent: function () {
                ok(true, "should call _renderIntoParent");
            }
        });

        shoeshine.Progenitor.addMocks({
            addToParent: function (parent) {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                strictEqual(parent, parentWidget, "should pass parent widget to trait");
                return this;
            }
        });

        strictEqual(childWidget.addToParent(parentWidget), childWidget, "should be chainable");

        shoeshine.Progenitor.removeMocks();
    });

    test("Re-adding to parent", function () {
        expect(0);

        var childWidget = shoeshine.Widget.create(),
            parentWidget = shoeshine.Widget.create();

        parentWidget.children.addMocks({
            getItem: function () {
                return childWidget;
            }
        });

        childWidget.addMocks({
            _renderIntoParent: function () {
                ok(true, "should NOT call _renderIntoParent");
            }
        });

        childWidget.addToParent(parentWidget);
    });

    test("Adding to detached parent", function () {
        expect(1);

        var childWidget = shoeshine.Widget.create(),
            parentWidget = shoeshine.Widget.create();

        parentWidget.addMocks({
            triggerSync: function (eventName) {
                equal(eventName, this.EVENT_CHILD_ADD, "should trigger addition event");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                return false;
            },

            afterAdd: function () {
                ok(true, "should NOT call afterAdd");
            },

            _renderIntoParent: function () {
            }
        });

        childWidget.addToParent(parentWidget);
    });

    test("Adding widget as root", function () {
        expect(6);

        var widget = shoeshine.Widget.create(),
            rootWidget = shoeshine.Widget.create();

        shoeshine.Widget.rootWidget = rootWidget;

        rootWidget.addMocks({
            removeRootWidget: function () {
                ok(true, "should remove old root widget");
                return this;
            }
        });

        widget.addMocks({
            afterAdd: function () {
                ok(true, "should call afterAdd");
                return this;
            },

            renderInto: function (targetElement) {
                ok(true, "should call renderInto");
                strictEqual(targetElement, document.getElementsByTagName('body')[0],
                    "should render into body");
                return this;
            }
        });

        strictEqual(widget.setRootWidget(), widget, "should be chainable");
        strictEqual(shoeshine.Widget.rootWidget, widget, "should set root widget");
    });

    test("Re-adding widget as root", function () {
        expect(0);

        var widget = shoeshine.Widget.create();

        shoeshine.Widget.rootWidget = widget;

        widget.addMocks({
            afterAdd: function () {
                ok(true, "should NOT call afterAdd");
                return this;
            },

            renderInto: function () {
                ok(true, "should NOT call renderInto");
                return this;
            }
        });

        widget.setRootWidget();
    });

    test("Root tester", function () {
        shoeshine.Widget.addMocks({
            afterAdd: function () {
            }
        });

        var rootWidget = shoeshine.Widget.create()
                .setRootWidget(),
            parentWidget = shoeshine.Widget.create(),
            childWidget1 = shoeshine.Widget.create()
                .addToParent(parentWidget),
            childWidget2 = shoeshine.Widget.create()
                .addToParent(rootWidget);

        shoeshine.Widget.removeMocks();

        ok(!childWidget1.isOnRoot(), "should return false for widgets not connected to root widget");
        ok(childWidget2.isOnRoot(), "should return true for widgets connected to root widget");
    });

    test("Removal from parent", function () {
        expect(7);

        var parentWidget = shoeshine.Widget.create(),
            childWidget = shoeshine.Widget.create()
                .addToParent(parentWidget);

        parentWidget.addMocks({
            triggerSync: function (eventName, payload) {
                equal(eventName, this.EVENT_CHILD_REMOVE, "should trigger removal event");
                strictEqual(payload.childWidget, childWidget, "should pass child name in payload");
            }
        });

        childWidget.addMocks({
            isOnRoot: function () {
                ok(true, "should determine if widget is connected to root widget");
                return true;
            },

            getElement: function () {
                ok(true, "should fetch DOM element");
            },

            afterRemove: function () {
                ok(true, "should call afterRemove");
            }
        });

        shoeshine.Progenitor.addMocks({
            removeFromParent: function () {
                strictEqual(this, childWidget, "should call trait's method on current widget");
                return this;
            }
        });

        strictEqual(childWidget.removeFromParent(), childWidget, "should be chainable");

        shoeshine.Progenitor.removeMocks();
    });

    test("Root widget removal", function () {
        expect(3);

        var widget = shoeshine.Widget.create();

        shoeshine.Widget.rootWidget = widget;

        widget.addMocks({
            removeFromParent: function () {
                ok(true, "should call removeFromParent");
            }
        });

        strictEqual(widget.removeRootWidget(), widget, "should be chainable");
        equal(typeof shoeshine.Widget.rootWidget, 'undefined', "should root widget to undefined");
    });

    test("Child widget name setter", function () {
        expect(5);

        var widget = shoeshine.Widget.create(),
            oldChildName = widget.childName;

        widget.addMocks({
            removeCssClass: function (className) {
                equal(className, oldChildName, "should remove current widget name from CSS classes");
                return this;
            },

            addCssClass: function (className) {
                equal(className, 'foo', "should add new widget name as CSS class");
                return this;
            }
        });

        shoeshine.Progenitor.addMocks({
            setChildName: function (childName) {
                strictEqual(this, widget, "should call trait's setChildName on current widget");
                equal(childName, 'foo', "should pass specified child name to trait");
                return this;
            }
        });

        strictEqual(widget.setChildName('foo'), widget, "should be chainable");

        shoeshine.Progenitor.removeMocks();
    });

    test("Adjacent widget getter", function () {
        expect(4);

        var widget = shoeshine.Widget.create(),
            targetParentElement = document.createElement('div'),
            instanceIds = [],
            widgets = {
                1  : {
                    childName: 'foo'
                },
                10 : {
                    childName: 'bar'
                },
                100: {
                    childName: 'baz'
                }
            };

        widget.addMocks({
            _getWidgetIdsInDom: function (parentElement) {
                strictEqual(parentElement, targetParentElement, "should get widget IDs under parent element");
                return ['w1', 'w10', 'w100'];
            }
        });

        sntls.Managed.addMocks({
            getInstanceById: function (instanceId) {
                instanceIds.push(instanceId);
                return widgets[instanceId];
            }
        });

        sntls.OrderedStringList.addMocks({
            spliceIndexOf: function (widgetName) {
                equal(widgetName, 'w11', "should fetch splice index for specified widget name");
                return 100;
            }
        });

        sntls.Collection.addMocks({
            getItem: function (itemName) {
                return {
                    1  : widgets[1],
                    10 : widgets[10],
                    100: widgets[100]
                }[itemName];
            }
        });

        strictEqual(widget.getAdjacentWidget('w11', targetParentElement), widgets[100], "should return widget adjacent to specified widget name");
        deepEqual(
            instanceIds.sort(),
            [1, 10, 100].sort(),
            "should fetch IDs of widgets under specified element");

        shoeshine.Widget.removeMocks();
        sntls.Managed.removeMocks();
        sntls.OrderedStringList.removeMocks();
        sntls.Collection.removeMocks();
    });

    // TODO: Add test for when adjacent widget's name is smaller than current.
    test("Rendering into element", function () {
        expect(8);

        var widget = shoeshine.Widget.create().setChildName('A'),
            adjacentWidget = shoeshine.Widget.create().setChildName('B'),
            targetElement = document.createElement('div'),
            adjacentElement = {};

        raises(function () {
            widget.renderInto();
        }, "should raise exception on missing argument");

        raises(function () {
            widget.renderInto('foo');
        }, "should raise exception on invalid argument");

        widget.addMocks({
            getAdjacentWidget: function () {
                ok(true, "should fetch adjacent widget");
                return adjacentWidget;
            },
            afterRender      : function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        adjacentWidget.addMocks({
            getElement: function () {
                ok(true, "should fetch element of adjacent widget");
                return adjacentElement;
            }
        });

        shoeshine.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, adjacentElement, "should call renderBefore with adjacent element");
                return this;
            }
        });

        strictEqual(widget.renderInto(targetElement), widget, "should be chainable");

        shoeshine.Renderable.removeMocks();
    });

    test("Rendering into element w/ no adjacent widget", function () {
        expect(3);

        var widget = shoeshine.Widget.create(),
            targetElement = document.createElement('div');

        widget.addMocks({
            getAdjacentWidget: function () {
                return undefined;
            },
            afterRender      : function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        shoeshine.Renderable.addMocks({
            renderInto: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call renderInto with target element");
                return this;
            }
        });

        widget.renderInto(targetElement);

        shoeshine.Renderable.removeMocks();
    });

    test("Rendering before element", function () {
        expect(6);

        var widget = shoeshine.Widget.create(),
            targetElement = document.createElement('div');

        raises(function () {
            widget.renderBefore();
        }, "should raise exception on missing argument");

        raises(function () {
            widget.renderBefore('foo');
        }, "should raise exception on invalid argument");

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        shoeshine.Renderable.addMocks({
            renderBefore: function (element) {
                strictEqual(this, widget, "should call trait's method");
                strictEqual(element, targetElement, "should call trait's method with target element");
                return this;
            }
        });

        strictEqual(widget.renderBefore(targetElement), widget, "should be chainable");

        shoeshine.Renderable.removeMocks();
    });

    test("Re-rendering", function () {
        expect(3);

        var widget = shoeshine.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        shoeshine.Renderable.addMocks({
            reRender: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRender(), widget, "should be chainable");

        shoeshine.Renderable.removeMocks();
    });

    test("Re-rendering content", function () {
        expect(3);

        var widget = shoeshine.Widget.create();

        widget.addMocks({
            afterRender: function () {
                ok(true, "should call afterRender");
                return this;
            }
        });

        shoeshine.Renderable.addMocks({
            reRenderContents: function () {
                strictEqual(this, widget, "should call trait's method");
                return this;
            }
        });

        strictEqual(widget.reRenderContents(), widget, "should be chainable");

        shoeshine.Renderable.removeMocks();
    });

    test("Default content markup template generation", function () {
        expect(2);

        var widget = shoeshine.Widget.create(),
            child = shoeshine.Widget.create(),
            template = ''.toMarkupTemplate();

        widget.addMocks({
            _getChildrenGroupedByContainer: function () {
                return sntls.Collection.create({
                    foo: child
                });
            }
        });

        shoeshine.Renderable.addMocks({
            contentMarkupAsTemplate: function () {
                return template;
            }
        });

        shoeshine.MarkupTemplate.addMocks({
            appendContainers: function (contents) {
                deepEqual(contents, {
                    foo: child
                }, "should append content to template");
                return this;
            }
        });

        strictEqual(widget.contentMarkupAsTemplate(), template, "should return cloned template instance");

        shoeshine.Renderable.removeMocks();
        shoeshine.MarkupTemplate.removeMocks();
    });

    test("Adding to hierarchy", function () {
        expect(4);

        var widget = shoeshine.Widget.create();

        widget.children.addMocks({
            addToHierarchy: function () {
                ok(true, "should call children's addToHierarchy");
            }
        });

        widget.addMocks({
            getLineage: function () {
                ok(true, "should fetch widget's lineage");
                return shoeshine.Progenitor.getLineage.call(this);
            },

            setEventPath: function (eventPath) {
                deepEqual(eventPath, [widget.instanceId].toPath().prepend(widget.ATTACHED_EVENT_PATH_ROOT),
                    "should set event path to lineage");
                return this;
            },

            addToRegistry: function () {
                ok(true, "should add widget to registry");
            }
        });

        widget.addToHierarchy();
    });

    test("Removing from hierarchy", function () {
        expect(5);

        var widget = shoeshine.Widget.create(),
            lineage = [widget.instanceId].toPath();

        widget.children.addMocks({
            removeFromHierarchy: function () {
                ok(true, "should call children's removeFromHierarchy");
            }
        });

        widget.addMocks({
            unsubscribeFrom: function () {
                ok(true, "should unsubscribe from widget events");
                return this;
            },

            getLineage: function () {
                ok(true, "should fetch widget's lineage");
                return lineage.clone();
            },

            setEventPath: function (eventPath) {
                deepEqual(eventPath, [widget.instanceId].toPath().prepend(widget.DETACHED_EVENT_PATH_ROOT),
                    "should set event path to lineage");
                return this;
            },

            removeFromRegistry: function () {
                ok(true, "should remove widget from registry");
            }
        });

        widget.removeFromHierarchy();
    });

    test("After render handler", function () {
        expect(2);

        var widget = shoeshine.Widget.create();

        widget.addMocks({
            getElement: function () {
                ok(true, "should fetch widget's DOM");
                return {};
            }
        });

        widget.children.addMocks({
            afterRender: function () {
                ok(true, "should call children's afterRender");
            }
        });

        widget.afterRender();
    });

    test("Triggering widget event", function () {
        expect(4);

        var widget = shoeshine.Widget.create();

        e$.Event.addMocks({
            triggerSync: function (eventPath) {
                ok(this.isA(shoeshine.WidgetEvent), "should spawn a WidgetEvent");
                strictEqual(eventPath, widget.eventPath, "should trigger event on widget's event path");
                equal(this.eventName, 'foo', "should trigger event by specified name");
            }
        });

        strictEqual(widget.triggerSync('foo'), widget, "should be chainable");

        e$.Event.removeMocks();
    });
}());
