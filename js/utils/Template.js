/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'Template', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name shoeshine.Template.create
     * @function
     * @param {string} text
     * @returns {shoeshine.Template}
     */

    /**
     * @class
     * @extends troop.Base
     */
    shoeshine.Template = self
        .addConstants(/** @lends shoeshine.Template */{
            /**
             * @type {RegExp}
             */
            RE_TEMPLATE_PLACEHOLDER: /{{([\w-]+)}}/g
        })
        .addMethods(/** @lends shoeshine.Template# */{
            /**
             * @param {string} text
             * @ignore
             */
            init: function (text) {
                /**
                 * Template string.
                 * @type {string}
                 */
                this.templateString = text;
            },

            /**
             * Fills single placeholder in the template and returns the completed string.
             * @param {string} placeholderName
             * @param {string} fillValue
             * @returns {string}
             */
            fillPlaceholder: function (placeholderName, fillValue) {
                return this.templateString.replace('{{' + placeholderName + '}}', fillValue);
            },

            /**
             * Fills multiple placeholders and returns the completed string.
             * @param {object} fillValues Pairs of placeholder names & fill values.
             * @returns {string}
             */
            fillPlaceholders: function (fillValues) {
                dessert.isPlainObject(fillValues, "Invalid placeholder fill values");

                return this.templateString.replace(this.RE_TEMPLATE_PLACEHOLDER, function (hit, placeholderName) {
                    return fillValues.hasOwnProperty(placeholderName) ?
                        // filling in provided string (or object w/ .toString())
                        fillValues[placeholderName] :
                        // re-inserting placeholder
                        placeholderName.toPlaceholder();
                });
            },

            /**
             * Clears placeholders by filling in all placeholders in the template with empty strings.
             * @returns {string}
             */
            clearPlaceholders: function () {
                return this.templateString.replace(this.RE_TEMPLATE_PLACEHOLDER, '');
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts current string to Template instance.
             * @returns {shoeshine.Template}
             */
            toTemplate: function () {
                return shoeshine.Template.create(this);
            },

            /**
             * Converts current string to placeholder string.
             * @returns {string}
             */
            toPlaceholder: function () {
                return '{{' + this + '}}';
            }
        },
        false, false, false
    );
}());
