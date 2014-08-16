/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'InlineStyles', function () {
    "use strict";

    var base = sntls.Collection,
        self = base.extend();

    /**
     * @name shoeshine.InlineStyles.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {shoeshine.InlineStyles}
     */

    /**
     * @class
     * @extends sntls.Collection
     */
    shoeshine.InlineStyles = self
        .addMethods(/** @lends shoeshine.InlineStyles# */{
            /** @returns {string} */
            toString: function () {
                var result = [];
                this.forEachItem(function (styleValue, styleName) {
                    result.push(styleName + ': ' + styleValue);
                });
                return result.join('; ');
            }
        });
});
