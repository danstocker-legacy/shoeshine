/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'HtmlAttributes', function () {
    "use strict";

    var base = sntls.Collection,
        self = base.extend();

    /**
     * @name shoeshine.HtmlAttributes.create
     * @function
     * @param {object|Array} [items] Initial contents.
     * @returns {shoeshine.HtmlAttributes}
     */

    /**
     * @class
     * @extends sntls.Collection
     */
    shoeshine.HtmlAttributes = self
        .addMethods(/** @lends shoeshine.HtmlAttributes# */{
            /**
             * @param {object|Array} [items] Initial contents.
             * @ignore
             */
            init: function (items) {
                base.init.call(this, items);

                /** @type {string} */
                this.idAttribute = undefined;

                /** @type {shoeshine.CssClasses} */
                this.cssClasses = shoeshine.CssClasses.create();

                /** @type {shoeshine.InlineStyles} */
                this.inlineStyles = shoeshine.InlineStyles.create();
            },

            /**
             * @param {string} idAttribute
             * @returns {shoeshine.HtmlAttributes}
             */
            setIdAttribute: function (idAttribute) {
                dessert.isString(idAttribute, "Invalid ID attribute");
                this.idAttribute = idAttribute;
                return this;
            },

            /**
             * @param {string} cssClass
             * @returns {shoeshine.HtmlAttributes}
             */
            addCssClass: function (cssClass) {
                this.cssClasses.addCssClass(cssClass);
                return this;
            },

            /**
             * @param {string} cssClass
             * @returns {shoeshine.HtmlAttributes}
             */
            removeCssClass: function (cssClass) {
                this.cssClasses.removeCssClass(cssClass);
                return this;
            },

            /**
             * @param {string} styleName
             * @param {string} styleValue
             * @returns {shoeshine.HtmlAttributes}
             */
            addInlineStyle: function (styleName, styleValue) {
                this.inlineStyles.setItem(styleName, styleValue);
                return this;
            },

            /**
             * @param {string} styleName
             * @returns {shoeshine.HtmlAttributes}
             */
            removeInlineStyle: function (styleName) {
                this.inlineStyles.deleteItem(styleName);
                return this;
            },

            /**
             * @returns {shoeshine.HtmlAttributes}
             */
            getFinalAttributes: function () {
                dessert.isString(this.idAttribute, "ID attribute not set");

                // not cloning on purpose so collections and properties don't carry over
                var htmlAttributes = this.getBase().create(this.items);

                htmlAttributes
                    .setItem('id', this.idAttribute)
                    .setItem('class', this.cssClasses.toString());

                if (this.inlineStyles.getKeyCount()) {
                    htmlAttributes.setItem('style', this.inlineStyles.toString());
                } else {
                    htmlAttributes.deleteItem('style');
                }

                return htmlAttributes;
            },

            /**
             * Clones HTML attributes with attached ID attribute, inline styles, and CSS classes.
             * @returns {shoeshine.HtmlAttributes}
             */
            clone: function () {
                var result = base.clone.call(this);

                result.idAttribute = this.idAttribute;
                result.cssClasses = this.cssClasses.clone();
                result.inlineStyles = this.inlineStyles.clone();

                return result;
            },

            /** @returns {string} */
            toString: function () {
                return this.getFinalAttributes()
                    .mapValues(function (value, attributeName) {
                        return attributeName + '="' + value + '"';
                    })
                    .getSortedValues()
                    .join(' ');
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isHtmlAttributes: function (expr) {
            return shoeshine.HtmlAttributes.isBaseOf(expr);
        },

        isHtmlAttributesOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   shoeshine.HtmlAttributes.isBaseOf(expr);
        }
    });
}());