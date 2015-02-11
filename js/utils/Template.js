/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'Template', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a Template instance.
     * Template instances may also be created via conversion from string.
     * @name shoeshine.Template.create
     * @function
     * @param {string} text Template string.
     * @returns {shoeshine.Template}
     * @see String#toTemplate
     */

    /**
     * The Template class implements basic string templating. Converting any string containing placeholders
     * to a Template instance allows those placeholders to be replaced via a simple API.
     * @class
     * @extends troop.Base
     */
    shoeshine.Template = self
        .addConstants(/** @lends shoeshine.Template */{
            /**
             * Used for replacing placeholders in the template.
             * @type {RegExp}
             * @constant
             */
            RE_TEMPLATE_PLACEHOLDER: /{{([\w-]+)}}/g
        })
        .addMethods(/** @lends shoeshine.Template# */{
            /**
             * @param {string} templateString
             * @ignore
             */
            init: function (templateString) {
                /**
                 * Original template string.
                 * @type {string}
                 */
                this.templateString = templateString;
            },

            /**
             * Fills single placeholder in the template and returns the completed string.
             * @param {string} placeholderName
             * @param {string} fillValue
             * @returns {string}
             */
            fillPlaceholder: function (placeholderName, fillValue) {
                var fillValues = {};
                fillValues[placeholderName] = fillValue;
                return this.fillPlaceholders(fillValues);
            },

            /**
             * Fills multiple placeholders and returns the completed string.
             * @param {object} fillValues Pairs of placeholder names & fill values.
             * @returns {string}
             */
            fillPlaceholders: function (fillValues) {
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
             * Converts `String` to `Template` instance.
             * @returns {shoeshine.Template}
             */
            toTemplate: function () {
                return shoeshine.Template.create(this);
            },

            /**
             * Converts string to placeholder string by wrapping it in double handlebars.
             * @returns {string}
             */
            toPlaceholder: function () {
                return '{{' + this + '}}';
            }
        },
        false, false, false
    );
}());
