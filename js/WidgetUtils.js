/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'WidgetUtils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
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
        .addMethods(/** @lends shoeshine.WidgetUtils */{
            /**
             * @param {string} hit
             * @returns {string}
             */
            replaceHtmlEntity: function (hit) {
                return self.ENTITY_MAP[hit] || hit;
            },

            /**
             * @param {string} text
             * @return {string} Escaped string.
             */
            htmlEscape: function (text) {
                return text.replace(this.RE_ESCAPE_CHARS, this.replaceHtmlEntity);
            },

            /**
             * @param {HTMLElement} element
             * @param {string} className
             * @returns {HTMLElement}
             */
            getParentNodeByClassName: function (element, className) {
                var classList;
                while (element) {
                    classList = element.classList;
                    if (classList && classList.contains(className)) {
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
             * Returns a HTML escaped string.
             * @returns {string}
             */
            toHtml: function () {
                return shoeshine.WidgetUtils.htmlEscape(this);
            }
        },
        false, false, false
    );
}());
