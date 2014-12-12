/*global dessert, troop, sntls, shoeshine */
troop.postpone(shoeshine, 'Progenitor', function (ns, className) {
    "use strict";

    var base = sntls.Managed,
        self = base.extend(className),
        slice = Array.prototype.slice;

    /**
     * The Progenitor trait manages parent-children relation between instances of the host class.
     * @class
     * @extends sntls.Managed
     */
    shoeshine.Progenitor = self
        .addMethods(/** @lends shoeshine.Progenitor# */{
            /** Call from host's .init */
            init: function () {
                base.init.call(this);

                /**
                 * Parent of current instance.
                 * When undefined, progenitor is considered a root instance.
                 * @type {shoeshine.Progenitor}
                 */
                this.parent = undefined;

                /**
                 * Name of the current instance in the context of its parent.
                 * @type {string}
                 */
                this.childName = this.instanceId.toString();

                /**
                 * Children: collection of other Progenitor instances.
                 * @type {sntls.Collection}
                 */
                this.children = sntls.Collection.create();
            },

            /**
             * Adds current instance to the specified parent Progenitor instance as child.
             * @param {shoeshine.Progenitor} parent
             * @returns {shoeshine.Progenitor}
             */
            addToParent: function (parent) {
                var childName, currentChild;

                if (parent !== this.parent) {
                    // specified parent is different than current

                    if (this.parent) {
                        // current instance has a parent
                        // removing child from current parent
                        this.removeFromParent();
                    }

                    childName = this.childName;
                    currentChild = parent.children.getItem(childName);

                    if (currentChild) {
                        // there is a child in parent by the current instance/s child name
                        // removing that instance
                        currentChild.removeFromParent();
                    }

                    // setting current instance as child in parent
                    parent.children.setItem(childName, this);

                    // updating parent reference
                    this.parent = parent;
                }

                return this;
            },

            /**
             * Adds the specified Progenitor instance to the current instance as child.
             * @param {shoeshine.Progenitor} child
             * @returns {shoeshine.Progenitor}
             */
            addChild: function (child) {
                child.addToParent(this);
                return this;
            },

            /**
             * Removes current instance from its parent.
             * Has no effect when current instance has no parent.
             * @returns {shoeshine.Progenitor}
             */
            removeFromParent: function () {
                var parent = this.parent;

                if (parent) {
                    // removing self from parent's children
                    parent.children.deleteItem(this.childName);

                    // clearing parent reference
                    this.parent = undefined;
                }

                return this;
            },

            /**
             * Removes specified Progenitor instance from current instance.
             * Has no effect if the specified instance is not child of the current instance.
             * @param {shoeshine.Progenitor} child
             * @returns {shoeshine.Progenitor}
             */
            removeChild: function (child) {
                if (this.children.getItem(child.childName) === child) {
                    child.removeFromParent();
                }
                return this;
            },

            /**
             * Removes all children from the current instance.
             * @returns {shoeshine.Progenitor}
             */
            removeChildren: function () {
                this.children.callOnEachItem('removeFromParent');
                return this;
            },

            /**
             * Changes child name for current instance.
             * Has no effect when specified child name is same as the current child name.
             * @param {string} childName
             * @returns {shoeshine.Progenitor}
             */
            setChildName: function (childName) {
                dessert.isString(childName, "Invalid child name");

                var parent = this.parent;

                if (childName !== this.childName) {
                    if (parent) {
                        // temporarily removing instance from parent
                        this.removeFromParent();
                    }

                    // changing name
                    this.childName = childName;

                    if (parent) {
                        // adding instance back to parent
                        this.addToParent(parent);
                    }
                }

                return this;
            },

            /**
             * Retrieves child instance matching the specified child name.
             * @param {string} childName
             * @returns {shoeshine.Progenitor}
             */
            getChild: function (childName) {
                return this.children.getItem(childName);
            },

            /**
             * Retrieves a collection of child instances matching the names specified as arguments.
             * When no argument is given, retrieves reference to the children collection.
             * @returns {sntls.Collection}
             */
            getChildren: function () {
                if (arguments.length) {
                    return this.children.filterByKeys(slice.call(arguments));
                } else {
                    return this.children;
                }
            },

            /**
             * Retrieves a collection of all instances in the current instance's progeny.
             * @returns {sntls.Collection}
             */
            getAllDescendants: function () {
                var result = sntls.Collection.create();

                (function getAllDescendants(parent) {
                    parent.children
                        .forEachItem(function (child) {
                            result.setItem(child.instanceId, child);
                            getAllDescendants(child);
                        });
                }(this));

                return result;
            },

            /**
             * Retrieves a Progenitor instance from the current instance's parent chain
             * matching the specified tester function. The tester receives one argument, which
             * is the Progenitor instance being traversed in the parent chain.
             * @param {function} tester
             * @returns {shoeshine.Progenitor}
             */
            getAncestor: function (tester) {
                dessert.isFunction(tester, "Invalid tester function");

                var parent = this.parent;

                while (parent && !tester(parent)) {
                    parent = parent.parent;
                }

                return parent;
            },

            /**
             * Retrieves the path that identifies the position of the current instance
             * relative to the root instance.
             * @returns {sntls.Path}
             */
            getLineage: function () {
                var asArray = [],
                    instance = this;

                while (instance) {
                    asArray.unshift(instance.instanceId);
                    instance = instance.parent;
                }

                return asArray.toPath();
            }
        });
});
