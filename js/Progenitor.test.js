/*global dessert, troop, sntls, s$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Progenitor");

    /**
     * @class
     * @extends troop.Base
     * @extends shoeshine.Progenitor
     */
    var Progenitor = troop.Base.extend()
        .addTrait(s$.Progenitor)
        .extend('myClass')
        .addMethods({
            init: function () {
                s$.Progenitor.init.call(this);
            }
        });

    test("Instantiation", function () {
        var instance = Progenitor.create();

        ok(instance.hasOwnProperty('parent'), "should add 'patent' property");
        equal(typeof instance.parent, 'undefined', "should set 'patent' property to undefined");
        ok(instance.children.isA(sntls.Collection), "should add children property");
        equal(instance.childName, instance.instanceId.toString(), "should set (default) child name to instance ID");
    });

    test("Adding to parent", function () {
        expect(5);

        var parent = Progenitor.create(),
            child1 = Progenitor.create(),
            child2 = Progenitor.create();

        parent.children.addMocks({
            getItem: function (childName) {
                equal(childName, child1.childName, "should fetch current child");
                return undefined;
            },

            setItem: function (childName, child) {
                equal(childName, child1.childName, "should set new child");
                strictEqual(child, child1, "should set new child to self");
                return this;
            }
        });

        child2.addMocks({
            removeFromParent: function () {
                ok(true, "should NOT remove current child from parent");
                return this;
            }
        });

        strictEqual(child1.addToParent(parent), child1, "should be chainable");
        strictEqual(child1.parent, parent, "should set parent property to specified value");
    });

    test("Adding to parent w/ existing child", function () {
        expect(4);

        var parent = Progenitor.create(),
            child1 = Progenitor.create(),
            child2 = Progenitor.create();

        parent.children.addMocks({
            getItem: function (childName) {
                equal(childName, child1.childName, "should fetch current child");
                return child2;
            },

            setItem: function (childName, child) {
                equal(childName, child1.childName, "should set new child");
                strictEqual(child, child1, "should set new child to self");
                return this;
            }
        });

        child2.addMocks({
            removeFromParent: function () {
                ok(true, "should remove current child from parent");
                return this;
            }
        });

        child1.addToParent(parent);
    });

    test("Adding child", function () {
        expect(2);

        var parent1 = Progenitor.create(),
            child = Progenitor.create();

        child.addMocks({
            addToParent: function (parent) {
                strictEqual(parent, parent1, "should call addToParent on specified child");
            }
        });

        strictEqual(parent1.addChild(child), parent1, "should be chainable");
    });

    test("Removal from parent", function () {
        expect(3);

        var parent = Progenitor.create(),
            child = Progenitor.create()
                .addToParent(parent);

        parent.children.addMocks({
            deleteItem: function (childName) {
                equal(childName, child.childName, "should remove child from parent matching name");
            }
        });

        strictEqual(child.removeFromParent(), child, "should be chainable");
        equal(typeof child.parent, 'undefined', "should set child's parent reference to undefined");
    });

    test("Removing child", function () {
        expect(3);

        var parent = Progenitor.create(),
            child = Progenitor.create()
                .addToParent(parent);

        parent.children.addMocks({
            getItem: function (childName) {
                equal(childName, child.childName, "should fetch child matching name of specified child");
                return child;
            }
        });

        child.addMocks({
            removeFromParent: function () {
                ok(true, "should call removeFromParent on specified child");
            }
        });

        strictEqual(parent.removeChild(child), parent, "should be chainable");
    });

    test("Removing all children", function () {
        var parent = Progenitor.create(),
            child1 = Progenitor.create()
                .addToParent(parent),
            child2 = Progenitor.create()
                .addToParent(parent);

        strictEqual(parent.removeChildren(), parent, "should be chainable");
        equal(parent.children.getKeyCount(), 0, "should clear children collection");
        equal(typeof child1.parent, 'undefined', "should set child's parent reference to undefined");
        equal(typeof child2.parent, 'undefined', "should set child's parent reference to undefined");
    });

    test("Setting child name", function () {
        expect(6);

        var parent1 = Progenitor.create(),
            child = Progenitor.create()
                .addToParent(parent1),
            originalChildName = child.childName;

        child.addMocks({
            removeFromParent: function () {
                ok(true, "should remove child from parent");
                equal(child.childName, originalChildName, "should remove child while name is still the old one");
            },

            addToParent: function (parent) {
                strictEqual(parent, parent1, "should add child back to parent");
                equal(child.childName, 'foo', "should add child while name is the new one");
            }
        });

        strictEqual(child.setChildName('foo'), child, "should be chainable");
        equal(child.childName, 'foo', "should set child name");
    });

    test("Child getter", function () {
        expect(2);

        var parent = Progenitor.create(),
            child = Progenitor.create();

        parent.children.addMocks({
            getItem: function (childName) {
                equal(childName, 'foo', "should fetch item from children collection by specified name");
                return child;
            }
        });

        strictEqual(parent.getChild('foo'), child, "should return the fetched item from children");
    });

    test("All children getter", function () {
        var parent = Progenitor.create();
        strictEqual(parent.getChildren(), parent.children, "should return children collection");
    });

    test("Children getter", function () {
        var parent = Progenitor.create(),
            child1 = Progenitor.create()
                .addToParent(parent),
            child2 = Progenitor.create()
                .addToParent(parent);

        // adding some more, anonymous children
        Progenitor.create().addToParent(parent);
        Progenitor.create().addToParent(parent);

        var children = parent.getChildren(child1.childName, child2.childName);

        ok(children.isA(sntls.Collection), "should return a collection");
        deepEqual(children.getValues(), [child1, child2], "should return collection w/ specified children");
    });

    test("Descendant collector", function () {
        var items = [],
            firstId = sntls.Documented.nextInstanceId,
            parent = Progenitor.create()
                .addChild(Progenitor.create()
                    .addChild(Progenitor.create()))
                .addChild(Progenitor.create()
                    .addChild(Progenitor.create())
                    .addChild(Progenitor.create()))
                .addChild(Progenitor.create());

        sntls.Collection.addMocks({
            setItem: function (itemName) {
                items.push(itemName);
                return this;
            }
        });

        var descendants = parent.getAllDescendants();

        sntls.Collection.removeMocks();

        ok(descendants.isA(sntls.Collection), "should return Collection instance");
        deepEqual(
            items.sort(),
            [firstId + 1, firstId + 2, firstId + 3, firstId + 4, firstId + 5, firstId + 6],
            "should traverse all descendants");
    });

    test("Ancestor getter", function () {
        var child1 = Progenitor.create(),
            child2 = Progenitor.create(),
            child3 = Progenitor.create(),
            child4 = Progenitor.create()
                .addToParent(child3
                    .addToParent(child2
                        .addToParent(child1))),
            result;

        child2.foo = 'bar';

        raises(function () {
            child4.getAncestor();
        }, "should raise exception on invalid arguments");

        result = child4.getAncestor(function (child) {
            return child.foo === 'bar';
        });

        strictEqual(result, child2, "should return ancestor matching tester");

        result = child4.getAncestor(function (child) {
            return child.hello === 'world';
        });

        equal(typeof result, 'undefined', "should return undefined when no parent matches tester");
    });

    test("Lineage getter", function () {
        var firstId = sntls.Documented.nextInstanceId,
            child = Progenitor.create()
                .addToParent(Progenitor.create()
                    .addToParent(Progenitor.create()
                        .addToParent(Progenitor.create()))),
            result;

        result = child.getLineage();

        ok(result.isA(sntls.Path), "should return Path instance");
        deepEqual(result.asArray, [firstId + 3, firstId + 2, firstId + 1, firstId],
            "should return path containing lineage");
    });
}());
