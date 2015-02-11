/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'MarkupTemplate', function () {
    "use strict";

    var base = shoeshine.Template,
        self = base.extend();

    /**
     * Creates a MarkupTemplate instance.
     * MarkupTemplate instances may also be created via conversion from string.
     * @name shoeshine.MarkupTemplate.create
     * @function
     * @param {string} text MarkupTemplate string.
     * @returns {shoeshine.MarkupTemplate}
     * @see String#toMarkupTemplate
     */

    /**
     * The MarkupTemplate class implements basic string templating. Converting any string containing placeholders
     * to a MarkupTemplate instance allows those placeholders to be replaced via a simple API.
     * @class
     * @extends shoeshine.Template
     */
    shoeshine.MarkupTemplate = self
        .setInstanceMapper(function (text) {
            return text;
        })
        .addConstants(/** @lends shoeshine.MarkupTemplate */{
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
        .addPrivateMethods(/** @lends shoeshine.MarkupTemplate */{
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
        .addMethods(/** @lends shoeshine.MarkupTemplate# */{
            /**
             * @param {string} templateString
             * @ignore
             */
            init: function (templateString) {
                base.init.call(this, templateString);

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
                    // identifying placeholder in template
                    placeholderName = placeholderNames[i];
                    targetIndex = placeholderLookup[placeholderName];

                    if (targetIndex >= 0) {
                        // placeholder is found in template
                        placeholder = preprocessedTemplate[targetIndex];

                        if (placeholder[0] === '{') {
                            // placeholder replacement
                            result[targetIndex] = fillValues[placeholderName];
                        } else {
                            // container addition
                            result[targetIndex] += fillValues[placeholderName];
                        }
                    }
                }

                return result.join('');
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `MarkupTemplate` instance.
             * @returns {shoeshine.MarkupTemplate}
             */
            toMarkupTemplate: function () {
                return shoeshine.MarkupTemplate.create(this);
            }
        },
        false, false, false
    );
}());
