/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'widgetEventSpace', function () {
    "use strict";

    /** @type {evan.EventSpace} */
    shoeshine.widgetEventSpace = evan.EventSpace.create();
});
