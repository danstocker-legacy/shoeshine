/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'WidgetUtils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * The WidgetUtils class is a static class containing general purpose utilities used by widgets.
     * @class
     * @extends troop.Base
     */
    shoeshine.WidgetUtils = self
        .addConstants(/** @lends shoeshine.WidgetUtils */{
            /**
             * @type {RegExp}
             * @constant
             */
            RE_ESCAPE_CHARS: /[&<>"'\n]|{{|}}/g,

            /**
             * @type {object}
             * @constant
             */
            ENTITY_MAP: {
                '&' : '&amp;',
                '<' : '&lt;',
                '>' : '&gt;',
                '"' : '&quot;',
                '\'': '&#39;',
                '{{': '&#123;&#123;',
                '}}': '&#125;&#125;'
            }
        })
        .addPrivateMethods(/** @lends shoeshine.WidgetUtils */{
            /**
             * Get the class list from an element
             * @param {HTMLElement} element
             * @returns {string[]}
             * @private
             */
            _getClassList: function  (element) {
                var className = element.className || '';

                if (typeof className === 'object' && 'baseVal' in className) {
                    className = className.baseVal;
                }

                return className.split(/\s/);
            }
        })
        .addMethods(/** @lends shoeshine.WidgetUtils */{
            /**
             * Replace callback function for escaping HTML entities.
             * @param {string} hit
             * @returns {string}
             */
            replaceHtmlEntity: function (hit) {
                return self.ENTITY_MAP[hit] || hit;
            },

            /**
             * Escapes HTML entities, quotes, and placeholder markers in the specified text.
             * @param {string} text
             * @return {string} Escaped string.
             */
            htmlEscape: function (text) {
                return text.replace(this.RE_ESCAPE_CHARS, this.replaceHtmlEntity);
            },

            /**
             * Retrieves the closest parent node of the specified element that has the specified CSS class.
             * @param {HTMLElement} element
             * @param {string} className
             * @returns {HTMLElement}
             */
            getParentNodeByClassName: function (element, className) {
                var classList;
                while (element) {
                    if (this._getClassList(element).indexOf(className) > -1) {
                        return element;
                    }
                    element = element.parentNode;
                }
                return undefined;
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts string to HTML escaped string.
             * @returns {string}
             */
            toHtml: function () {
                return shoeshine.WidgetUtils.htmlEscape(this);
            }
        },
        false, false, false
    );
}());
