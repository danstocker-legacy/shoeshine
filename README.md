Shoeshine
=========

*Widget framework*

Shoeshine serves as the basis of building a modular, and event-driven view-controller layer for a front end application that is based on [troop](https://github.com/production-minds/troop) for OOP, [sntls](https://github.com/danstocker/sntls) for data structures, and [evan](https://github.com/danstocker/evan) for universal events.

For a set of common widgets (labels, buttons, dropdowns, forms) based on shoeshine, look into [candystore](https://github.com/danstocker/candystore).

The `Widget` class implements a life cycle, plus incorporates a number of traits that augment its behavior:

- `evan.Evented` so that widget instances may trigger and capture events on themselves
- `sntls.Documented` so that widget classes may have class names assigned, and instances unique instance IDs
- `sntls.Managed` so that widget instances may be stored in and retrieved from a global registry
- `shoeshine.Progenitor` so that widget instances may be arranged in a parent-children relation
- `shoeshine.Renderable` so that widgets may be rendered into the DOM

In order to implement your own widget classes, subclass `shoeshine.Widget`. Make sure to supply a class name to `.extend()`, as `Widget` overrides `troop.Base.extend()` to make it more widget-specific. The class name will end up on the new widget class as static property (`.className`), as well as a CSS class name on the markup generated for its instances.

    var MyWidget = shoeshine.Widget.extend('MyWidget')
        .addMethods({
            init: function () {
                // initialize instance
            },

            afterAdd: function () {
                base.afterAdd.call(this);
                // widget added to widget hierarchy
            },

            afterRemove: function () {
                base.afterRemove.call(this);
                // widget removed from widget hierarchy
            },

            afterRender: function () {
                base.afterRender.call(this);
                // widget rendered, its DOM is ready for use
            },

            contentMarkup: function () {
                return 'This is the inner markup if the widget';
            }
        });

To use the widget, simply set it as a *root widget*, or add it as a child to a widget already existing in the hierarchy.

    MyWidget.create().setRootWidget();

or,

    MyWidget.create().addToParent(parentWidget);
