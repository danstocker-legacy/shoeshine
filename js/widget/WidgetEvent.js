/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'WidgetEvent', function () {
    "use strict";

    var base = evan.Event,
        self = base.extend();

    /**
     * @name shoeshine.WidgetEvent.create
     * @function
     * @param {string} eventName Event name
     * @param {evan.EventSpace} eventSpace Event space associated with event
     * @returns {shoeshine.WidgetEvent}
     */

    /**
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

                /** @type {shoeshine.Widget} */
                this.senderWidget = undefined;
            },

            /**
             * @param {shoeshine.Widget} senderWidget
             * @returns {shoeshine.WidgetEvent}
             */
            setSenderWidget: function (senderWidget) {
                dessert.isWidget(senderWidget, "Invalid sender widget");
                this.senderWidget = senderWidget;
                return this;
            },

            /** @returns {shoeshine.WidgetEvent} */
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
