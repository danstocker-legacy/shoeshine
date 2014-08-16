/*global dessert, troop, sntls, evan, s$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Widget Event");

    test("Instantiation", function () {
        var widgetEvent = s$.WidgetEvent.create('foo', s$.widgetEventSpace);

        ok(widgetEvent.hasOwnProperty('senderWidget'), "should add senderWidget property to event");
        equal(typeof widgetEvent.senderWidget, 'undefined', "should set senderWidget property to undefined");
    });

    test("Conversion from Event", function () {
        var widgetEvent = evan.Event.create('foo', s$.widgetEventSpace);
        ok(widgetEvent.isA(s$.WidgetEvent), "should return WidgetEvent instance");
    });

    test("Setting sender", function () {
        var widget = s$.Widget.create(),
            widgetEvent = s$.WidgetEvent.create('foo', s$.widgetEventSpace);

        raises(function () {
            widgetEvent.setSenderWidget("invalid");
        }, "should raise exception on invalid argument");

        strictEqual(widgetEvent.setSenderWidget(widget), widgetEvent, "should be chainable");
        strictEqual(widgetEvent.senderWidget, widget, "should set senderWidget to widget");
    });

    test("Cloning", function () {
        var widget = s$.Widget.create(),
            widgetEvent = s$.WidgetEvent.create('foo', s$.widgetEventSpace)
                .setSenderWidget(widget),
            clonedEvent = widgetEvent.clone('foo>bar'.toPath());

        ok(clonedEvent.isA(s$.WidgetEvent), "should return WidgetEvent instance");
        notStrictEqual(clonedEvent, widgetEvent, "should return different instance than the cloned");
        strictEqual(clonedEvent.senderWidget, widgetEvent.senderWidget, "should set sender widget to original");
    });
}());
