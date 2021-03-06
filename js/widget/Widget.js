/*global dessert, troop, sntls, evan, shoeshine, Event */
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
     * Creates a Widget instance.
     * Widgets already inserted into the hierarchy may be retrieved via conversion from their widget IDs.
     * @example
     * 'w1'.toWidget()
     * @name shoeshine.Widget.create
     * @function
     * @returns {shoeshine.Widget}
     */

    /**
     * The Widget class is the base class for all *shoeshine*-based widgets.
     * As stateful view-controllers, the widgets' role is to keep the view (DOM) in sync with the model.
     * The Widget implements the life cycle: created - added - rendered - removed, to each stage of which user-defined
     * handlers may be added.
     * @class
     * @extends troop.Base
     * @extends evan.Evented
     * @extends shoeshine.Progenitor
     * @extends shoeshine.Renderable
     */
    shoeshine.Widget = self
        .addConstants(/** @lends shoeshine.Widget */{
            /** @constant */
            EVENT_CHILD_ADD: 'child-add',

            /** @constant */
            EVENT_CHILD_REMOVE: 'child-remove',

            /**
             * @type {sntls.Path}
             * @constant
             */
            ATTACHED_EVENT_PATH_ROOT: 'widget>attached'.toPath(),

            /**
             * @type {sntls.Path}
             * @constant
             */
            DETACHED_EVENT_PATH_ROOT: 'widget>detached'.toPath()
        })
        .addPublic(/** @lends shoeshine.Widget */{
            /**
             * Stores all HTML attributes, including CSS classes and inline styles.
             * @type {shoeshine.HtmlAttributes}
             */
            htmlAttributes: shoeshine.HtmlAttributes.create()
                .addCssClass(className),

            /**
             * Root widget. All other widgets descend from this.
             * There can be only one root widget at a time, but the root widget may be replaced at any time.
             * @type {shoeshine.Widget}
             * @see shoeshine.Widget#setRootWidget
             */
            rootWidget: undefined
        })
        .addPrivateMethods(/** @lends shoeshine.Widget# */{
            /**
             * Retrieves a list of widget IDs to be found under the specified DOM element.
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
            },

            /**
             * Retrieves current child widgets grouped by container CSS class name.
             * @returns {sntls.Collection}
             * @private
             */
            _getChildrenGroupedByContainer: function () {
                var that = this;

                return this.children
                    .collectProperty('containerCssClass')
                    .toStringDictionary()
                    .reverse()
                    .toCollection()
                    .mapValues(function (childNames) {
                        return childNames instanceof Array ?
                            that.getChildren.apply(that, childNames) :
                            that.getChild(childNames);
                    });
            }
        })
        .addMethods(/** @lends shoeshine.Widget# */{
            /**
             * Extends the widget class. Same as `troop.Base.extend()` in all respects except for incorporating the
             * functionality of `Documented.extend()`, and adding the class name to the HTML attributes as CSS class.
             * @example
             * var MyWidget = shoeshine.Widget.extend('MyWidget');
             * @param {string} className
             * @returns {shoeshine.Widget}
             * @see troop.Base.extend
             * @see sntls.Documented.extend
             */
            extend: function (className) {
                var that = sntls.Documented.extend.call(this, className);

                that.htmlAttributes = this.htmlAttributes.clone()
                    .addCssClass(className);

                return that;
            },

            /**
             * Adds trait to widget class. Same as `troop.addTrait()`, except for optionally adding the trait name
             * to the widget's HTML attributes as CSS class.
             * @example
             * var MyWidget = shoeshine.Widget.extend('MyWidget')
             *     .addTrait(TraitClass, 'TraitClass');
             * @param {object} trait
             * @param {string} [traitName] Name of trait. Must be the same as the name of the trait object.
             * @returns {shoeshine.Widget} Widget class the method was called on.
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
             * Adds trait to widget class, and extends the class afterwards. Same as `troop.addTrait()`,
             * except for optionally adding the trait name to the widget's HTML attributes as CSS class.
             * @param {troop.Base} trait
             * @param {string} [traitName] Name of trait. Must be the same as the name of the trait object.
             * @returns {shoeshine.Widget} Extended widget class.
             */
            addTraitAndExtend: function (trait, traitName) {
                return this
                    .addTrait(trait, traitName)
                    .extend(this.className);
            },

            /** @ignore */
            init: function () {
                shoeshine.Progenitor.init.call(this);

                var widgetId = this.instanceId.toWidgetId();

                shoeshine.Renderable.init.call(this,
                    this.htmlAttributes.clone()
                        .setIdAttribute(widgetId));

                /**
                 * Specifies what element to render the widget in in the context of its parents' DOM.
                 * The first element found to be having this CSS class will be the parent DOM node
                 * for the current widget's DOM.
                 * @type {string}
                 */
                this.containerCssClass = undefined;

                /**
                 * Child widgets. Modifies the `children` property delegated by `shoeshine.Progenitor`
                 * by treating it as a `WidgetCollection` rather than a regular `sntls.Collection`.
                 * @type {shoeshine.WidgetCollection}
                 */
                this.children = this.children.toWidgetCollection();

                // initializing Evented trait
                this.setEventSpace(shoeshine.widgetEventSpace)
                    .setEventPath(this.getLineage().prepend(this.DETACHED_EVENT_PATH_ROOT));

                // setting default child name to (unique) widget ID
                this.setChildName(widgetId);
            },

            /**
             * Sets container CSS class property. The widget, when added to a parent, will be rendered inside the first
             * element to be found inside the parent's DOM bearing this CSS class.
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
             * Also triggers rendering the child inside the parent's DOM, according to `.containerCssClass`.
             * @param {shoeshine.Widget} parentWidget
             * @returns {shoeshine.Widget}
             * @see shoeshine.Widget#containerCssClass
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
                        this.addToHierarchy()
                            .afterAdd();
                    }

                    // triggering event about being added
                    parentWidget
                        .spawnEvent(this.EVENT_CHILD_ADD)
                        .setPayloadItem('childWidget', this)
                        .triggerSync();

                    if (document) {
                        this._renderIntoParent();
                    }
                }

                return this;
            },

            /**
             * Sets / replaces root widget with current widget.
             * @returns {shoeshine.Widget}
             */
            setRootWidget: function () {
                var rootWidget = this.rootWidget;

                if (rootWidget !== this) {
                    if (rootWidget) {
                        rootWidget.removeRootWidget();
                    }

                    shoeshine.Widget.rootWidget = this;

                    this.addToHierarchy()
                        .afterAdd();

                    if (document && !this.getElement()) {
                        this.renderInto(document.getElementsByTagName('body')[0]);
                    }
                }

                return this;
            },

            /**
             * Removes current widget from its parent.
             * Has no effect when current widget has no parent.
             * @returns {shoeshine.Widget}
             */
            removeFromParent: function () {
                var element = this.getElement(),
                    parent = this.parent,
                    wasAttachedToRoot = this.isOnRoot();

                shoeshine.Progenitor.removeFromParent.call(this);

                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }

                if (wasAttachedToRoot) {
                    this.removeFromHierarchy()
                        .afterRemove();
                }

                if (parent) {
                    // triggering event about removal
                    parent
                        .spawnEvent(this.EVENT_CHILD_REMOVE)
                        .setPayloadItem('childWidget', this)
                        .triggerSync();
                }

                return this;
            },

            /**
             * Removes current widget as root widget.
             * @returns {shoeshine.Widget}
             */
            removeRootWidget: function () {
                this.removeFromParent();
                self.rootWidget = undefined;
                return this;
            },

            /**
             * Sets name of current widget in the context of its parent.
             * For widgets it also determines the order in which they are rendered inside the same container element.
             * @param {string} childName
             * @returns {shoeshine.Widget}
             */
            setChildName: function (childName) {
                var oldChildName = this.childName;

                shoeshine.Progenitor.setChildName.call(this, childName);

                if (childName !== oldChildName) {
                    this.removeCssClass(oldChildName)
                        .addCssClass(childName);
                }

                return this;
            },

            /**
             * Fetches child widgets and returns them as a WidgetCollection.
             * @returns {shoeshine.WidgetCollection}
             */
            getChildren: function () {
                return shoeshine.Progenitor.getChildren.apply(this, arguments)
                    .filterByType(shoeshine.Widget)
                    .toWidgetCollection();
            },

            /**
             * Retrieves the widget that is adjacent to the widget specified by its `childName` property
             * in the context of the specified parent (DOM) element.
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
             * Renders current widget into the specified (DOM) element.
             * @param {HTMLElement} element
             * @returns {shoeshine.Widget}
             */
            renderInto: function (element) {
                dessert.isElement(element, "Invalid target element");

                var adjacentWidget = this.getAdjacentWidget(this.childName, element);

                if (adjacentWidget && adjacentWidget.childName >= this.childName) {
                    // when there is an adjacent widget whose childName is bigger than that of the current widget
                    shoeshine.Renderable.renderBefore.call(this, adjacentWidget.getElement());
                } else {
                    shoeshine.Renderable.renderInto.call(this, element);
                }

                this.afterRender();

                return this;
            },

            /**
             * Renders current widget before the specified (DOM) element.
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
             * Re-renders element in its current position in the DOM.
             * Using `reRender` is considered an anti-pattern. Even though re-rendering an already rendered widget
             * does update the widget's DOM, but it is proven to be slow, and risks memory leaks in case there are
             * hard references held to the old DOM. It also makes transitions, input focus, etc. harder to manage.
             * @returns {shoeshine.Widget}
             */
            reRender: function () {
                shoeshine.Renderable.reRender.call(this);
                this.afterRender();
                return this;
            },

            /**
             * Re-renders element's contents.
             * Using `reRenderContents` is considered an anti-pattern. Even though re-rendering an already rendered
             * widget does update the widget's DOM, but it is proven to be slow, and risks memory leaks
             * in case there are hard references held to the old DOM contents. It also makes transitions,
             * input focus, etc. harder to manage.
             * @returns {shoeshine.Widget}
             */
            reRenderContents: function () {
                shoeshine.Renderable.reRenderContents.call(this);
                this.afterRender();
                return this;
            },

            /**
             * Retrieves content markup as a filled-in MarkupTemplate.
             * Override this method to add more content to the template.
             * @returns {shoeshine.MarkupTemplate}
             * @ignore
             */
            contentMarkupAsTemplate: function () {
                return shoeshine.Renderable.contentMarkupAsTemplate.call(this)
                    .appendContent(this._getChildrenGroupedByContainer().items);
            },

            /**
             * Default content markup definition for widgets.
             * Renders children as DOM siblings inside their container in order of their child names.
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.contentTemplate ?
                    this.contentMarkupAsTemplate().toString() :
                    this.children.toString();
            },

            /**
             * Adds widget and its children to the hierarchy, updating their event paths and adding them to registry.
             * Not part of the public Widget API, do not call directly.
             * @returns {shoeshine.Widget}
             */
            addToHierarchy: function () {
                // setting event path for triggering widget events
                this.setEventPath(this.getLineage().prepend(this.ATTACHED_EVENT_PATH_ROOT));

                // adding widget to lookup registry
                this.addToRegistry();

                this.children.addToHierarchy();

                return this;
            },

            /**
             * Override method that is called after the widget is added to the hierarchy.
             * This is the place to initialize the widget lifecycle. Eg. sync the widget's state to the model,
             * subscribe to events, etc.
             * Make sure the override calls the `afterAdd` method of the super and all traits that implement it.
             */
            afterAdd: function () {
                this.children.afterAdd();
            },

            /**
             * Removes widget and its children from the hierarchy, updating their event path,
             * unsubscribing from widget events, and removing them from registry.
             * Not part of the public Widget API, do not call directly.
             * @returns {shoeshine.Widget}
             */
            removeFromHierarchy: function () {
                this.children.removeFromHierarchy();

                // unsubscribing from all widget events
                this.unsubscribeFrom();

                // (re-)setting event path to new lineage
                this.setEventPath(this.getLineage().prepend(this.DETACHED_EVENT_PATH_ROOT));

                // removing widget from lookup registry
                this.removeFromRegistry();

                return this;
            },

            /**
             * Override method that is called after the widget is removed from the hierarchy.
             * This is the place to de-initialize the widget lifecycle, usually by countering the actions taken in
             * `afterAdd`. Eg. unsubscribing from events.
             * Make sure the override calls the `afterRemove` method of the super and all traits that implement it.
             */
            afterRemove: function () {
                this.children.afterRemove();
            },

            /**
             * Override method that is called after the widget is rendered into the DOM.
             * This is the place to initialize the widget's DOM. Eg. by subscribing to UI events,
             * triggering transitions, etc.
             * Make sure the override calls the `afterRender` method of the super and all traits that implement it.
             */
            afterRender: function () {
                if (this.getElement()) {
                    this.children.afterRender();
                }
            },

            /**
             * Spawns a widget event that has the senderWidget property set.
             * @param {string} eventName
             * @returns {shoeshine.WidgetEvent}
             */
            spawnEvent: function (eventName) {
                return evan.Evented.spawnEvent.call(this, eventName)
                    .setSenderWidget(this);
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {shoeshine.Widget} expr */
        isWidget: function (expr) {
            return shoeshine.Widget.isBaseOf(expr);
        },

        /** @param {shoeshine.Widget} expr */
        isWidgetOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   shoeshine.Widget.isBaseOf(expr);
        },

        /** @param {Element} expr */
        isElement: function (expr) {
            return expr instanceof Element;
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * Converts `String` to `Widget` by looking up the widget corresponding to the current string
             * as its widget ID. Conversion yields no result when the widget is not in the hierarchy.
             * String must be in the 'w#' format (lowercase 'w' followed by digits).
             * @returns {shoeshine.Widget}
             */
            toWidget: function () {
                return sntls.Managed.getInstanceById(this.toInstanceIdFromWidgetId());
            },

            /**
             * Converts string widget ID ('w###') to an instance ID (number).
             * @returns {number}
             */
            toInstanceIdFromWidgetId: function () {
                return parseInt(this.slice(1), 10);
            }
        },
        false, false, false
    );

    troop.Properties.addProperties.call(
        Number.prototype,
        /** @lends Number# */{
            /**
             * Converts current number as instance ID to widget ID.
             * The widget ID is used as the ID attribute of the rendered widget's container element.
             * @returns {string}
             */
            toWidgetId: function () {
                return 'w' + this;
            }
        },
        false, false, false
    );

    if (Element) {
        troop.Properties.addProperties.call(
            Element.prototype,
            /** @lends Element# */{
                /**
                 * Converts `Element` to `Widget` using the element's ID attribute as widget ID.
                 * @returns {shoeshine.Widget}
                 */
                toWidget: function () {
                    return sntls.Managed.getInstanceById(this.id.toInstanceIdFromWidgetId());
                }
            },
            false, false, false
        );
    }

    if (Event) {
        troop.Properties.addProperties.call(
            Event.prototype,
            /** @lends Event# */{
                /**
                 * Converts `Event` to `Widget`.
                 * Uses the event's target to look up the nearest parent element matching the specified class name.
                 * Then uses the element that was found as basis for conversion from `Element` to `Widget`.
                 * @param {string} [cssClassName]
                 * @returns {shoeshine.Widget}
                 * @see Element#toWidget
                 */
                toWidget: function (cssClassName) {
                    cssClassName = cssClassName || shoeshine.Widget.className;

                    var childElement = this.target,
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
