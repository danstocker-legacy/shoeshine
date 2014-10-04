/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'CssClasses', function () {
    "use strict";

    var base = sntls.Collection,
        self = base.extend();

    /**
     * Creates a CssClasses instance.
     * @name shoeshine.CssClasses.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {shoeshine.CssClasses}
     */

    /**
     * The CssClasses class is a serializable Collection of CSS class names.
     * @class
     * @extends troop.Base
     */
    shoeshine.CssClasses = self
        .addMethods(/** @lends shoeshine.CssClasses# */{
            /**
             * Adds specified CSS class to the collection.
             * @param {string} cssClass
             * @returns {shoeshine.CssClasses}
             */
            addCssClass: function (cssClass) {
                this.setItem(cssClass, cssClass);
                return this;
            },

            /**
             * Removes specified CSS class from the collection.
             * @param {string} cssClass
             * @returns {shoeshine.CssClasses}
             */
            removeCssClass: function (cssClass) {
                this.deleteItem(cssClass);
                return this;
            },

            /**
             * Serializes CSS classes into a space separated string that can be used as an HTML "class" attribute.
             * @example
             * shoeshine.CssClasses.create()
             *     .addCssClass('foo')
             *     .addCssClass('bar')
             *     .toString() // "foo bar"
             * @returns {string}
             */
            toString: function () {
                return this
                    .getSortedValues()
                    .join(' ');
            }
        });
});
