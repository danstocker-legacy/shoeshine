/**
 * Top-Level Library Namespace
 */
/*global require */
/** @namespace */
var shoeshine = {},
    s$ = shoeshine;

/**
 * @class
 * @see https://github.com/production-minds/dessert
 */
var dessert = dessert || require('dessert');

/**
 * @namespace
 * @see https://github.com/danstocker/troop
 */
var troop = troop || require('troop');

/**
 * @namespace
 * @see https://github.com/danstocker/sntls
 */
var sntls = sntls || require('sntls');

/**
 * @namespace
 * @see https://github.com/danstocker/evan
 */
var evan = evan || require('evan');

/**
 * @function
 * @see http://api.jquery.com
 */
var jQuery = jQuery || require('jquery');

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}
/**
 * Native DOM element class.
 * @name Element
 */
var Element = Element || undefined;

/**
 * Native DOM event class.
 * @name Event
 */
var Event = Event || undefined;

/**
 * Native number class.
 * @name Number
 * @class
 */

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name sntls.Hash
 * @class
 */
