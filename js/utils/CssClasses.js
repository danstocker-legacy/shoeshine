/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'CssClasses', function () {
    "use strict";

    var base = sntls.Collection,
        self = base.extend();

    /**
     * @name shoeshine.CssClasses.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {shoeshine.CssClasses}
     */

    /**
     * @class
     * @extends troop.Base
     */
    shoeshine.CssClasses = self
        .addMethods(/** @lends shoeshine.CssClasses# */{
            /**
             * @param {string} cssClass
             * @returns {shoeshine.CssClasses}
             */
            addCssClass: function (cssClass) {
                this.setItem(cssClass, cssClass);
                return this;
            },

            /**
             * @param {string} cssClass
             * @returns {shoeshine.CssClasses}
             */
            removeCssClass: function (cssClass) {
                this.deleteItem(cssClass);
                return this;
            },

            /** @returns {string} */
            toString: function () {
                return this
                    .getSortedValues()
                    .join(' ');
            }
        });
});
