/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'HandlebarsTemplate', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a HandlebarsTemplate instance.
     * HandlebarsTemplate instances may also be created via conversion from string.
     * @name shoeshine.HandlebarsTemplate.create
     * @function
     * @param {string} text HandlebarsTemplate string.
     * @returns {shoeshine.HandlebarsTemplate}
     * @see String#toHandlebarsTemplate
     */

    /**
     * Implements basic, placeholder-based templating. Converting any string containing placeholders
     * to a HandlebarsTemplate instance allows those placeholders to be replaced via a simple API.
     * @class
     * @extends troop.Base
     */
    shoeshine.HandlebarsTemplate = self
        .addConstants(/** @lends shoeshine.HandlebarsTemplate */{
            /**
             * Used for replacing placeholders in the template.
             * @type {RegExp}
             * @constant
             */
            RE_TEMPLATE_PLACEHOLDER: /{{([\w-]+)}}/g
        })
        .addMethods(/** @lends shoeshine.HandlebarsTemplate# */{
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
             * Fills multiple placeholders and returns the resulting string.
             * @param {object} placeholderValuePairs Pairs of placeholder names & content values.
             * @returns {string}
             */
            setContent: function (placeholderValuePairs) {
                return this.templateString.replace(this.RE_TEMPLATE_PLACEHOLDER, function (hit, placeholderName) {
                    return placeholderValuePairs.hasOwnProperty(placeholderName) ?
                        // filling in provided string (or object w/ .toString())
                        placeholderValuePairs[placeholderName] :
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
             * Converts `String` to `HandlebarsTemplate` instance.
             * @returns {shoeshine.HandlebarsTemplate}
             */
            toHandlebarsTemplate: function () {
                return shoeshine.HandlebarsTemplate.create(this);
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
