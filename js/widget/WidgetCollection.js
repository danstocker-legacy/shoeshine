/*global dessert, troop, sntls, evan, shoeshine */
troop.postpone(shoeshine, 'WidgetCollection', function () {
    "use strict";

    var base = sntls.Collection.of(shoeshine.Widget),
        self = base.extend();

    /**
     * @name shoeshine.WidgetCollection.create
     * @function
     * @param {object} [items]
     * @returns {shoeshine.WidgetCollection}
     */

    /**
     * @class
     * @extends sntls.Collection
     * @extends shoeshine.Widget
     */
    shoeshine.WidgetCollection = self
        .addMethods(/** @lends shoeshine.WidgetCollection# */{
            /** @returns {string} */
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
            /** @returns {shoeshine.WidgetCollection} */
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
            /** @returns {shoeshine.WidgetCollection} */
            toWidgetCollection: function () {
                return shoeshine.WidgetCollection.create(this);
            }
        },
        false, false, false
    );
}());
