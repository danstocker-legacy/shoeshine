/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'WidgetCollection', function () {
    "use strict";

    var base = sntls.Collection.of(shoeshine.Widget),
        self = base.extend();

    /**
     * Creates a WidgetCollection instance.
     * @name shoeshine.WidgetCollection.create
     * @function
     * @param {object} [items]
     * @returns {shoeshine.WidgetCollection}
     */

    /**
     * The WidgetCollection is a specified collection merging the Collection API with the Widget API.
     * Also allows serialization of all widgets in the collection into a single string.
     * @class
     * @extends sntls.Collection
     * @extends shoeshine.Widget
     */
    shoeshine.WidgetCollection = self
        .addMethods(/** @lends shoeshine.WidgetCollection# */{
            /**
             * Generates the markup for all widgets in the collection, in the order of their names.
             * @returns {string}
             */
            toString: function () {
                return this.callOnEachItem('toString')
                    .getSortedValues()
                    .join('');
            }
        });
});

troop.amendPostponed(sntls, 'Hash', function () {
    "use strict";

    sntls.Hash
        .addMethods(/** @lends sntls.Hash# */{
            /**
             * Converts `Hash` to `WidgetCollection`.
             * @returns {shoeshine.WidgetCollection}
             */
            toWidgetCollection: function () {
                return shoeshine.WidgetCollection.create(this.items);
            }
        });
});

(function () {
    "use strict";

    troop.Properties.addProperties.call(
        Array.prototype,
        /** @lends Array# */{
            /**
             * Converts array of `Widget` instances to a `WidgetCollection`.
             * @returns {shoeshine.WidgetCollection}
             */
            toWidgetCollection: function () {
                return shoeshine.WidgetCollection.create(this);
            }
        },
        false, false, false
    );
}());
