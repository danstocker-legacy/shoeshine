/*jshint node:true */
module.exports = function (grunt) {
    "use strict";

    var params = {
        files: [
            'js/namespace.js',
            'js/utils/WidgetUtils.js',
            'js/utils/Template.js',
            'js/utils/CssClasses.js',
            'js/utils/InlineStyles.js',
            'js/utils/HtmlAttributes.js',
            'js/behaviors/Progenitor.js',
            'js/behaviors/Renderable.js',
            'js/behaviors/JqueryWidget.js',
            'js/widget/widgetEventSpace.js',
            'js/widget/WidgetEvent.js',
            'js/widget/Widget.js',
            'js/widget/WidgetCollection.js',
            'js/exports.js'
        ],

        test: [
            'js/utils/jsTestDriver.conf',
            'js/behaviors/jsTestDriver.conf',
            'js/widget/jsTestDriver.conf'
        ],

        globals: {
            dessert: true,
            troop  : true,
            sntls  : true,
            evan   : true
        }
    };

    // invoking common grunt process
    require('common-gruntfile')(grunt, params);
};
