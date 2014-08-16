/*global dessert, troop, sntls, jQuery, shoeshine */
troop.postpone(shoeshine, 'JqueryWidget', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
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
                var classSelector = '.w' + this.className;

                return selector.indexOf(classSelector) === -1 ?
                    classSelector + ' ' + selector :
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
                var globalSelector = this._getGlobalSelector(selector);

                this._jqueryOnProxy(eventName, globalSelector, function (/**UIEvent*/event) {
                    var widget = event.toWidget();
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
