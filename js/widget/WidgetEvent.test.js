/*global dessert, troop, sntls, evan, shoeshine */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Widget Event");

    test("Instantiation", function () {
        var widgetEvent = shoeshine.WidgetEvent.create('foo', shoeshine.widgetEventSpace);

        ok(widgetEvent.hasOwnProperty('senderWidget'), "should add senderWidget property to event");
        equal(typeof widgetEvent.senderWidget, 'undefined', "should set senderWidget property to undefined");
    });

    test("Conversion from Event", function () {
        var widgetEvent = evan.Event.create('foo', shoeshine.widgetEventSpace);
        ok(widgetEvent.isA(shoeshine.WidgetEvent), "should return WidgetEvent instance");
    });

    test("Setting sender", function () {
        var widget = shoeshine.Widget.create(),
            widgetEvent = shoeshine.WidgetEvent.create('foo', shoeshine.widgetEventSpace);

        raises(function () {
            widgetEvent.setSenderWidget("invalid");
        }, "should raise exception on invalid argument");

        strictEqual(widgetEvent.setSenderWidget(widget), widgetEvent, "should be chainable");
        strictEqual(widgetEvent.senderWidget, widget, "should set senderWidget to widget");
    });

    test("Cloning", function () {
        var widget = shoeshine.Widget.create(),
            widgetEvent = shoeshine.WidgetEvent.create('foo', shoeshine.widgetEventSpace)
                .setSenderWidget(widget),
            clonedEvent = widgetEvent.clone('foo>bar'.toPath());

        ok(clonedEvent.isA(shoeshine.WidgetEvent), "should return WidgetEvent instance");
        notStrictEqual(clonedEvent, widgetEvent, "should return different instance than the cloned");
        strictEqual(clonedEvent.senderWidget, widgetEvent.senderWidget, "should set sender widget to original");
    });
}());
