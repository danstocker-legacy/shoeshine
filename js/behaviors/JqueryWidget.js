/*global dessert, troop, sntls, jQuery, shoeshine */
troop.postpone(shoeshine, 'JqueryWidget', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Trait that adds class-level (delegated) jQuery event subscription capability to the host.
     * When used on other traits, call methods directly on JqueryWidget.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    shoeshine.JqueryWidget = self
        .addConstants(/** @lends shoeshine.JqueryWidget */{
            /** @type {jQuery} */
            $document: $(document)
        })
        .addPrivateMethods(/** @lends shoeshine.JqueryWidget */{
            /**
             * @param {string} eventName
             * @param {string} selector
             * @param {function} handler
             * @private
             */
            _jqueryOnProxy: function (eventName, selector, handler) {
                self.$document.on(eventName, selector, handler);
            },

            /**
             * @param {string} eventName
             * @param {string} selector
             * @param {function} [handler]
             * @private
             */
            _jqueryOffProxy: function (eventName, selector, handler) {
                self.$document.off(eventName, selector, handler);
            },

            /**
             * @param {string} selector
             * @returns {string}
             * @private
             */
            _getGlobalSelector: function (selector) {
                var className = this.className,
                    classSelector = '.' + className;

                return className ?
                    selector.indexOf(classSelector) === -1 ?
                        classSelector + ' ' + selector :
                        selector :
                    selector;
            }
        })
        .addMethods(/** @lends shoeshine.JqueryWidget */{
            /**
             * @param {string} eventName
             * @param {string} selector
             * @param {string} methodName
             * @returns {shoeshine.JqueryWidget}
             */
            on: function (eventName, selector, methodName) {
                var globalSelector = this._getGlobalSelector(selector),
                    className = this.className;

                this._jqueryOnProxy(eventName, globalSelector, function (/**jQuery.Event*/event) {
                    var widget = event.originalEvent.toWidget(className);
                    return widget ?
                        widget[methodName].apply(widget, arguments) :
                        undefined;
                });

                return this;
            },

            /**
             * @param {string} eventName
             * @param {string} selector
             * @returns {shoeshine.JqueryWidget}
             */
            off: function (eventName, selector) {
                var globalSelector = this._getGlobalSelector(selector);

                this._jqueryOffProxy(eventName, globalSelector);

                return this;
            }
        });
}, jQuery);
