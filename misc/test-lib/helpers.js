// jasmine matcher for expecting an element to have a css class
// https://github.com/angular/angular.js/blob/master/test/matchers.js
beforeEach(function() {
  this.addMatchers({
    toHaveClass: function(cls) {
      this.message = function() {
        return "Expected '" + this.actual + "'" + (this.isNot ? ' not ' : ' ') + "to have class '" + cls + "'.";
      };

      return this.actual.hasClass(cls);
    },
    toBeHidden: function () {
      var element = angular.element(this.actual);
      return element.hasClass('ng-hide') ||
        element.css('display') == 'none';
    }
  });
});

// borrowed from https://github.com/angular/angular.js/blob/0f9fd2f642ee251e61f8fb80132500c94db5e47a/test/helpers/testabilityPatch.js#L98
function dealoc(obj) {
  var jqCache = angular.element.cache;
  if (obj) {
    if (angular.isElement(obj)) {
      cleanup(angular.element(obj));
    } else if (!window.jQuery) {
      // jQuery 2.x doesn't expose the cache storage.
      for (var key in jqCache) {
        var value = jqCache[key];
        if (value.data && value.data.$scope == obj) {
          delete jqCache[key];
        }
      }
    }
  }

  function cleanup(element) {
    element.off().removeData();
    if (window.jQuery) {
      // jQuery 2.x doesn't expose the cache storage; ensure all element data
      // is removed during its cleanup.
      jQuery.cleanData([element]);
    }
    // Note:  We aren't using element.contents() here.  Under jQuery, element.contents() can fail
    // for IFRAME elements.  jQuery explicitly uses (element.contentDocument ||
    // element.contentWindow.document) and both properties are null for IFRAMES that aren't attached
    // to a document.
    var children = element[0].childNodes || [];
    for (var i = 0; i < children.length; i++) {
      cleanup(angular.element(children[i]));
    }
  }
}
