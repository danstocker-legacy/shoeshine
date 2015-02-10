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
        .setInstanceMapper(function (text) {
            return text;
        })
        .addConstants(/** @lends shoeshine.Template */{
            /**
             * Used for replacing placeholders in the template.
             * @type {RegExp}
             * @constant
             */
            RE_TEMPLATE_PLACEHOLDER: /{{[\w-]+}}/g,

            /**
             * Splits along template placeholders and tags.
             * Leaves an empty slot after each tag and placeholder in the resulting array.
             * @type {RegExp}
             * @constant
             */
            RE_TEMPLATE_PREPROCESSOR: /(\s*(?=<)|{{[\w-]+}})/,

            /**
             * Splits a tag to extract class list.
             * Extracted class list will be found in result[1].
             * @type {RegExp}
             * @constant
             */
            RE_CLASS_LIST_FROM_TAG: /class\s*=\s*"\s*([\w-]+(?:\s+[\w-]+)*)\s*"/,

            /**
             * Matches a class list.
             * Resulting array will contain extracted classes.
             * @type {RegExp}
             * @constant
             */
            RE_CLASS_FROM_CLASS_LIST: /[\w-]+/g,

            /**
             * Matches a placeholder.
             * Extracted string will be found in result[1].
             * @type {RegExp}
             * @constant
             */
            RE_PLACEHOLDER_NAME_FROM_PLACEHOLDER: /^{{([\w-]+)}}$/
        })
        .addPrivateMethods(/** @lends shoeshine.Template */{
            /**
             * @param {string} tag
             * @returns {string}
             * @private
             */
            _extractClassListFromTag: function (tag) {
                var classNames = tag.split(this.RE_CLASS_LIST_FROM_TAG);
                return classNames && classNames[1];
            },

            /**
             * @param {string} classList
             * @returns {string[]}
             * @private
             */
            _extractClassesFromClassList: function (classList) {
                return classList.match(this.RE_CLASS_FROM_CLASS_LIST);
            },

            /**
             * @param {string} placeholder
             * @returns {string}
             * @private
             */
            _extractPlaceholderNameFromPlaceholder: function (placeholder) {
                var placeholderNames = placeholder.match(this.RE_PLACEHOLDER_NAME_FROM_PLACEHOLDER);
                return placeholderNames && placeholderNames[1];
            },

            /**
             * @param {string} templateFragment
             * @returns {string|string[]}
             * @private
             */
            _processTemplateFragment: function (templateFragment) {
                var classList = this._extractClassListFromTag(templateFragment);
                return classList && this._extractClassesFromClassList(classList) ||
                       this._extractPlaceholderNameFromPlaceholder(templateFragment);
            }
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

                /**
                 * Blown up string where the placeholders need to be substituted and joined to get the final text.
                 * @type {sntls.Collection}
                 */
                this.preprocessedTemplate = this.templateString.split(this.RE_TEMPLATE_PREPROCESSOR)
                    .toCollection();

                /**
                 * Defines lookup between placeholder names and positions in the preprocessed template.
                 * @type {sntls.StringDictionary}
                 */
                this.placeholderLookup = this.preprocessedTemplate
                    .mapValues(this._processTemplateFragment, this)
                    .toStringDictionary()
                    .reverse()
                    .toCollection()
                    .passEachItemTo(parseInt, this, 0, 10);
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
                var preprocessedTemplate = this.preprocessedTemplate.items,
                    placeholderLookup = this.placeholderLookup.items,
                    result = preprocessedTemplate.concat(),
                    placeholderNames = Object.keys(fillValues),
                    i, placeholderName, targetIndex, placeholder;

                for (i = 0; i < placeholderNames.length; i++) {
                    placeholderName = placeholderNames[i];
                    targetIndex = placeholderLookup[placeholderName];
                    placeholder = preprocessedTemplate[targetIndex];

                    if (placeholder[0] === '{') {
                        // placeholder replacement
                        result[targetIndex] = fillValues[placeholderName];
                    } else {
                        // container addition
                        result[targetIndex] += fillValues[placeholderName];
                    }
                }

                return result.join('');
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
