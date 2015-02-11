/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'MarkupTemplate', function () {
    "use strict";

    var base = troop.Base,
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
     * Template class that implements a template markup, where containers are identified by their CSS classes.
     * The template is filled in by specifying content for each container.
     * @class
     * @extends troop.Base
     */
    shoeshine.MarkupTemplate = self
        .addConstants(/** @lends shoeshine.MarkupTemplate */{
            /**
             * Splits along template placeholders and tags.
             * Leaves an empty slot after each tag and placeholder in the resulting array.
             * @type {RegExp}
             * @constant
             */
            RE_MARKUP_SPLITTER: /(?=<)/,

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
            RE_CLASS_FROM_CLASS_LIST: /[\w-]+/g
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
             * @param {string} templateFragment
             * @returns {string|string[]}
             * @private
             */
            _processTemplateFragment: function (templateFragment) {
                var classList = this._extractClassListFromTag(templateFragment);
                return classList && this._extractClassesFromClassList(classList);
            }
        })
        .addMethods(/** @lends shoeshine.MarkupTemplate# */{
            /**
             * @param {string} templateString
             * @ignore
             */
            init: function (templateString) {
                /**
                 * Blown up string where the placeholders need to be substituted and joined to get the final text.
                 * @type {sntls.Collection}
                 */
                this.preprocessedTemplate = templateString.split(this.RE_MARKUP_SPLITTER)
                    .toCollection();

                /**
                 * Defines lookup between container names and positions in the preprocessed template.
                 * @type {sntls.StringDictionary}
                 */
                this.containerLookup = this.preprocessedTemplate
                    .mapValues(this._processTemplateFragment, this)
                    .toStringDictionary()
                    .reverse()
                    .toCollection()
                    .passEachItemTo(parseInt, this, 0, 10);
            },

            /**
             * Appends containers with specified content.
             * Do not call this on the original template. Clone first.
             * @param {object} contents Pairs of container CSS classes & associated content.
             * @returns {shoeshine.MarkupTemplate}
             */
            appendContainers: function (contents) {
                var preprocessedTemplate = this.preprocessedTemplate.items,
                    containerLookup = this.containerLookup.items,
                    containerNames = Object.keys(contents),
                    i, containerName, targetIndex;

                for (i = 0; i < containerNames.length; i++) {
                    // identifying placeholder in template
                    containerName = containerNames[i];
                    targetIndex = containerLookup[containerName];

                    if (targetIndex >= 0) {
                        // placeholder is found in template
                        preprocessedTemplate[targetIndex] += contents[containerName];
                    }
                }

                return this;
            },

            /**
             * Fills containers in the template.
             * @param {object} contents Pairs of container CSS classes & associated content.
             * @returns {string}
             */
            fillContainers: function (contents) {
                return this.clone()
                    .appendContainers(contents)
                    .toString();
            },

            /**
             * Clones markup template.
             * @returns {shoeshine.MarkupTemplate}
             */
            clone: function () {
                var result = this.getBase().create('');
                result.preprocessedTemplate = this.preprocessedTemplate.clone();
                result.containerLookup = this.containerLookup.clone();
                return result;
            },

            /**
             * Serializes markup template.
             * @returns {string}
             */
            toString: function () {
                return this.preprocessedTemplate.items.join('');
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
