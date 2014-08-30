/*global dessert, troop, sntls, evan, shoeshine, UIEvent */
troop.postpone(shoeshine, 'Widget', function (ns, className) {
    "use strict";

    var slice = Array.prototype.slice,
        base = troop.Base,
        self = base.extend()
            // trait methods do not overlap, can go on same prototype level
            .addTrait(shoeshine.Progenitor)
            .addTrait(shoeshine.Renderable)
            .addTrait(evan.Evented)
            .extend(className);

    /**
     * @name shoeshine.Widget.create
     * @function
     * @returns {shoeshine.Widget}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     * @extends shoeshine.Progenitor
     * @extends shoeshine.Renderable
     */
    shoeshine.Widget = self
        .setEventSpace(shoeshine.widgetEventSpace)
        .addPublic(/** @lends shoeshine.Widget */{
            /** @type {shoeshine.HtmlAttributes} */
            htmlAttributes: shoeshine.HtmlAttributes.create()
                .addCssClass(className),

            /** @type {shoeshine.Widget} */
            rootWidget: undefined
        })
        .addPrivateMethods(/** @lends shoeshine.Widget# */{
            /**
             * @param {HTMLElement} element
             * @return {string[]} List of widget IDs.
             * @private
             */
            _getWidgetIdsInDom: function (element) {
                var re;

                if (element) {
                    re = /^w\d+$/;

                    return slice.call(element.childNodes)
                        .map(function (item) {
                            return item.id;
                        })
                        .filter(function (item) {
                            return re.test(item);
                        });
                } else {
                    return [];
                }
            },

            /**
             * Renders widget into parent element.
             * If widget has containerCssClass specified, it will render within the matching element.
             * @private
             */
            _renderIntoParent: function () {
                var parentElement = this.parent.getElement(),
                    containerCssClass = this.containerCssClass;

                if (parentElement) {
                    if (containerCssClass) {
                        parentElement = parentElement.getElementsByClassName(containerCssClass)[0] || parentElement;
                    }

                    this.renderInto(parentElement);
                }
            }
        })
        .addMethods(/** @lends shoeshine.Widget# */{
            /**
             * @param {string} className
             * @returns {shoeshine.Widget}
             */
            extend: function (className) {
                var that = sntls.Documented.extend.call(this, className);

                that.htmlAttributes = this.htmlAttributes.clone()
                    .addCssClass(className);

                return that;
            },

            /**
             * @param {object} trait
             * @param {string} [traitName]
             * @returns {shoeshine.Widget}
             */
            addTrait: function (trait, traitName) {
                dessert.isStringOptional(traitName, "Invalid trait name");

                base.addTrait.call(this, trait);

                if (traitName) {
                    this.htmlAttributes.addCssClass(traitName);
                }

                return this;
            },

            /**
             * Adds trait to widget class by the specified name, then extends the class.
             * @param {troop.Base} trait
             * @param {string} [traitName]
             * @returns {shoeshine.Widget}
             */
            addTraitAndExtend: function (trait, traitName) {
                return this
                    .addTrait(trait, traitName)
                    .extend(this.className);
            },

            /**
             * @ignore
             */
            init: function () {
                shoeshine.Progenitor.init.call(this);

                var widgetId = this.instanceId.toWidgetId();

                shoeshine.Renderable.init.call(this,
                    this.htmlAttributes.clone()
                        .setIdAttribute(widgetId));

                /** @type {string} */
                this.containerCssClass = undefined;

                /** @type {shoeshine.WidgetCollection} */
                this.children = this.children.toWidgetCollection();

                // initializing Evented trait
                // TODO: Use .setEventPath() as soon as it's fixed in evan
                this.eventPath = this.getLineage();

                this.setChildName(widgetId);
            },

            /**
             * Sets container CSS class property.
             * @param {string} containerCssClass
             * @returns {shoeshine.Widget}
             */
            setContainerCssClass: function (containerCssClass) {
                dessert.isString(containerCssClass, "Invalid container selector");
                this.containerCssClass = containerCssClass;
                return this;
            },

            /**
             * Determines whether current widget is connected to the root widget via its parent chain.
             * @returns {boolean}
             */
            isOnRoot: function () {
                var widget = this;
                while (widget.parent) {
                    widget = widget.parent;
                }
                return widget === this.rootWidget;
            },

            /**
             * Adds current widget to specified parent as child.
             * @param {shoeshine.Widget} parentWidget
             * @returns {shoeshine.Widget}
             */
            addToParent: function (parentWidget) {
                dessert.isWidget(parentWidget, "Invalid parent widget");

                var childName = this.childName,
                    currentChild = parentWidget.children.getItem(childName);

                shoeshine.Progenitor.addToParent.call(this, parentWidget);

                if (currentChild !== this) {
                    // child on parent may be replaced
                    if (this.isOnRoot()) {
                        // current widget is attached to root widget
                        // widget lifecycle method may be run
                        this.afterAdd();
                    }

                    if (document) {
                        this._renderIntoParent();
                    }
                }

                return this;
            },

            /**
             * Replaces root widget with current widget.
             * @returns {shoeshine.Widget}
             */
            setRootWidget: function () {
                var rootWidget = this.rootWidget;

                if (rootWidget !== this) {
                    if (rootWidget) {
                        rootWidget.removeRootWidget();
                    }

                    shoeshine.Widget.rootWidget = this;

                    this.afterAdd();

                    this.renderInto(document.getElementsByTagName('body')[0]);
                }

                return this;
            },

            /**
             * Removes current widget from its parent.
             * Has no effect when current widget has no parent.
             * @returns {shoeshine.Widget}
             */
            removeFromParent: function () {
                shoeshine.Progenitor.removeFromParent.call(this);

                var parent = this.parent,
                    element = this.getElement(),
                    wasAttachedToRoot = this.isOnRoot();

                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }

                if (parent) {
                    parent.children.deleteItem(this.childName);
                    this.parent = undefined;
                }

                if (wasAttachedToRoot) {
                    this.afterRemove();
                }

                return this;
            },

            /**
             * Removes current widget as root widget.
             * @returns {shoeshine.Widget}
             */
            removeRootWidget: function () {
                self.rootWidget = undefined;
                this.afterRemove();
                return this;
            },

            /**
             * @param {string} childName
             * @returns {shoeshine.Widget}
             */
            setChildName: function (childName) {
                var oldChildName = this.childName;

                shoeshine.Progenitor.setChildName.call(this, childName);

                if (childName !== oldChildName) {
                    this.htmlAttributes
                        .removeCssClass(oldChildName)
                        .addCssClass(childName);
                }

                return this;
            },

            /**
             * Fetches child widgets and returns them in a WidgetCollection.
             * @returns {shoeshine.WidgetCollection}
             */
            getChildren: function () {
                return shoeshine.Progenitor.getChildren.apply(this, arguments)
                    .filterByType(shoeshine.Widget)
                    .toWidgetCollection();
            },

            /**
             * Retrieves the widget that is adjacent to the specified widget name
             * in the context of the specified parent DOM element.
             * @param {string} childName
             * @param {HTMLElement} parentElement
             * @returns {shoeshine.Widget}
             */
            getAdjacentWidget: function (childName, parentElement) {
                var childWidgetIds = sntls.Collection.create(this._getWidgetIdsInDom(parentElement)),
                    childWidgets = childWidgetIds
                        .callOnEachItem('toWidget'),
                    childWidgetNames = childWidgets
                        .collectProperty('childName')
                        .toOrderedStringList(),
                    spliceIndex = childWidgetNames.spliceIndexOf(childName);

                return childWidgets.getItem(spliceIndex.toString());
            },

            /**
             * @param {HTMLElement} element
             * @returns {shoeshine.Widget}
             */
            renderInto: function (element) {
                dessert.isElement(element, "Invalid target element");

                var adjacentWidget = this.getAdjacentWidget(this.childName, element);

                if (adjacentWidget) {
                    shoeshine.Renderable.renderBefore.call(this, adjacentWidget.getElement());
                } else {
                    shoeshine.Renderable.renderInto.call(this, element);
                }

                this.afterRender();

                return this;
            },

            /**
             * @param {HTMLElement} element
             * @returns {shoeshine.Widget}
             */
            renderBefore: function (element) {
                dessert.isElement(element, "Invalid target element");
                shoeshine.Renderable.renderBefore.call(this, element);
                this.afterRender();
                return this;
            },

            /**
             * @returns {shoeshine.Widget}
             */
            reRender: function () {
                shoeshine.Renderable.reRender.call(this);
                this.afterRender();
                return this;
            },

            /**
             * Override method that is called after the widget is added to the hierarchy.
             * TODO: Previous implementation suggests there are cases when child widgets'
             * parent references are not set to the actual parent and need to be aligned.
             * Need to confirm.
             */
            afterAdd: function () {
                this.children.afterAdd();

                // setting event path for triggering widget events
                // TODO: Use .setEventPath() as soon as it's fixed in evan
                this.eventPath = this.getLineage();

                // adding widget to lookup registry
                this.addToRegistry();
            },

            /**
             * Override method that is called after the widget is removed from the hierarchy.
             */
            afterRemove: function () {
                this.children.afterRemove();

                // unsubscribing from all widget events
                this.unsubscribeFrom();

                // (re-)setting event path to new lineage
                // TODO: Use .setEventPath() as soon as it's fixed in evan
                this.eventPath = this.getLineage();

                // removing widget from lookup registry
                this.removeFromRegistry();
            },

            /**
             * Override method that is called after the widget is rendered into the DOM.
             */
            afterRender: function () {
                if (this.getElement()) {
                    this.children.afterRender();
                }
            },

            /**
             * Triggers widget event with the sender set to the current widget.
             * @param {string} eventName
             * @param {*} [payload]
             * @returns {shoeshine.Widget}
             */
            triggerSync: function (eventName, payload) {
                this.spawnEvent(eventName)
                    .setSenderWidget(this)
                    .triggerSync(this.eventPath, payload);
                return this;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /**
         * @param {shoeshine.Widget} expr
         */
        isWidget: function (expr) {
            return shoeshine.Widget.isBaseOf(expr);
        },

        /**
         * @param {shoeshine.Widget} expr
         */
        isWidgetOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   shoeshine.Widget.isBaseOf(expr);
        },

        /**
         * @param {Element} expr
         */
        isElement: function (expr) {
            return expr instanceof Element;
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /** @returns {shoeshine.Widget} */
            toWidget: function () {
                return sntls.Managed.getInstanceById(this.toInstanceIdFromWidgetId());
            },

            /** @returns {number} */
            toInstanceIdFromWidgetId: function () {
                return parseInt(this.slice(1), 10);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Number.prototype,
        /** @lends Number# */{
            /** @returns {string} */
            toWidgetId: function () {
                return 'w' + this;
            }
        },
        false, false, false
    );

    if (UIEvent) {
        troop.Properties.addProperties.call(
            UIEvent.prototype,
            /** @lends UIEvent# */{
                /**
                 * @returns {shoeshine.Widget}
                 */
                toWidget: function () {
                    var cssClassName = shoeshine.Widget.className,
                        childElement = this.target,
                        widgetElement = shoeshine.WidgetUtils.getParentNodeByClassName(childElement, cssClassName);

                    return widgetElement ?
                        sntls.Managed.getInstanceById(widgetElement.id.toInstanceIdFromWidgetId()) :
                        undefined;
                }
            },
            false, false, false
        );
    }
}());
