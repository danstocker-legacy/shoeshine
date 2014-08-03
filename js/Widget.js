/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'Widget', function () {
    "use strict";

    var base = troop.Base;

    /**
     * @name shoeshine.Widget.create
     * @function
     * @returns {shoeshine.Widget}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends sntls.Managed
     * @extends evan.Evented
     */
    shoeshine.Widget = base.extend()
        .addMethods(/** @lends shoeshine.Widget# */{
            /**
             * @ignore
             */
            init: function () {
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {shoeshine.Widget} expr
         */
        isWidget: function (expr) {
            return shoeshine.Widget.isBaseOf(expr);
        },

        /**
         * @param {shoeshine.Widget} expr
         */
        isWidgetOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   shoeshine.Widget.isBaseOf(expr);
        }
    });
}());
