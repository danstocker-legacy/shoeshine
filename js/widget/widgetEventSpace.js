/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'widgetEventSpace', function () {
    "use strict";

    /**
     * Event space dedicated to widget events.
     * @type {evan.EventSpace}
     */
    shoeshine.widgetEventSpace = evan.EventSpace.create();
});
