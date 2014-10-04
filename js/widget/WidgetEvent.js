/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'WidgetEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * Creates a WidgetEvent instance.
     * Do not instantiate this class directly. Spawn events on the event space `shoeshine.widgetEventSpace`,
     * or an Evented instance, like a Widget.
     * WidgetEvent may also be instantiated by creating an `evan.Event` with `shoeshine.WidgetEventSpace`
     * specified as event space.
     * @name shoeshine.WidgetEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @returns {shoeshine.WidgetEvent}
     */

    /**
     * The WidgetEvent implements special event features for widgets.
     * @class
     * @extends evan.Event
     */
    shoeshine.WidgetEvent = self
        .addMethods(/** @lends shoeshine.WidgetEvent# */{
            /**
             * @param {string} [eventName]
             * @param {evan.EventSpace} [eventSpace]
             * @ignore
             */
            init: function (eventName, eventSpace) {
                base.init.call(this, eventName, eventSpace);

                /**
                 * Widget from which the event originated.
                 * @type {shoeshine.Widget}
                 */
                this.senderWidget = undefined;
            },

            /**
             * Sets `senderWidget` property.
             * @param {shoeshine.Widget} senderWidget
             * @returns {shoeshine.WidgetEvent}
             */
            setSenderWidget: function (senderWidget) {
                dessert.isWidget(senderWidget, "Invalid sender widget");
                this.senderWidget = senderWidget;
                return this;
            },

            /**
             * Clones Event instance. Copies `senderWidget` reference to the new event instance.
             * @returns {shoeshine.WidgetEvent}
             */
            clone: function () {
                return base.clone.apply(this, arguments)
                    .setSenderWidget(this.senderWidget);
            }
        });
});

troop.amendPostponed(evan, 'Evan', function () {
    "use strict";

    evan.Event
        .addSurrogate(shoeshine, 'WidgetEvent', function (eventName, eventSpace) {
            return eventSpace === shoeshine.widgetEventSpace;
        });
});
