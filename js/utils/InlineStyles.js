/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'InlineStyles', function () {
    "use strict";

    var base = sntls.Collection,
        self = base.extend();

    /**
     * Creates an InlineStyles instance.
     * @name shoeshine.InlineStyles.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {shoeshine.InlineStyles}
     */

    /**
     * The InlineStyles class is a collection of style key-value pairs that can be
     * serialized in the correct style definition format.
     * @class
     * @extends sntls.Collection
     */
    shoeshine.InlineStyles = self
        .addMethods(/** @lends shoeshine.InlineStyles# */{
            /**
             * Serializes style collection so that it can be used in a tag as attribute.
             * The order of styles is not determined.
             * @example
             * shoeshine.InlineStyles.create()
             *      .setItem('display', 'inline-block')
             *      .setItem('overflow', 'hidden')
             *      .toString() // "display: inline-block; overflow: hidden"
             * @returns {string}
             */
            toString: function () {
                var result = [];
                this.forEachItem(function (styleValue, styleName) {
                    result.push(styleName + ': ' + styleValue);
                });
                return result.join('; ');
            }
        });
});
