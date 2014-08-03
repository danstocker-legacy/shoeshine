/*global dessert, troop, sntls, evan, s$ */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Widget Utils");

    test("HTML escape", function () {
        equal(s$.WidgetUtils.htmlEscape("Q&A"), "Q&amp;A",
            "should escape ampersand");
        equal(
            s$.WidgetUtils.htmlEscape("<script>alert('foo');</script>"),
            "&lt;script&gt;alert(&#39;foo&#39;);&lt;/script&gt;",
            "should escape injected HTML"
        );
        equal(
            s$.WidgetUtils.htmlEscape("Hello {{name}}!"),
            "Hello &#123;&#123;name&#125;&#125;!",
            "should escape template"
        );
    });

    test("Conversion to HTML encoded string", function () {
        equal('{{Q&A}}'.toHtml(), '&#123;&#123;Q&amp;A&#125;&#125;', "should return HTML encoded string");
    });

    test("Getting parent node by class name", function () {
        var element = document.createElement('div');
        element.innerHTML = [
            '<div id="e1" class="outmost">' +
            '<div id="e2" class="middle">' +
            '<div id="e3" class="innermost">' +
            '</div>' +
            '</div>' +
            '</div>'
        ].join('');

        var e1 = element.getElementsByClassName('outmost')[0],
            e2 = element.getElementsByClassName('middle')[0],
            e3 = element.getElementsByClassName('innermost')[0];

        strictEqual(s$.WidgetUtils.getParentNodeByClassName(e3, 'innermost'), e3,
            "should fetch self when specified class is matching");
        strictEqual(s$.WidgetUtils.getParentNodeByClassName(e3, 'middle'), e2,
            "should fetch parent with specified class");
        equal(typeof s$.WidgetUtils.getParentNodeByClassName(e3, 'foo'), 'undefined',
            "should return undefined when no such parent exists");
    });
}());
