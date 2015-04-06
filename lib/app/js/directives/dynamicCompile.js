'use strict';

angular.module('sgApp')
  .directive('dynamicCompile', function($compile, $parse) {
    return {
      link: function(scope, element, attrs) {
        var parsed = $parse(attrs.ngBindHtml);
        function getStringValue() { return (parsed(scope) || '').toString(); }
        // Recompile if the template changes
        scope.$watch(getStringValue, function() {
          $compile(element, null, 0)(scope);
        });
        // When the dependencies of the hosted app are finished loading, recompile.
        // This is necessary because the dependencies are lazy loaded and when
        // they are ready, the directive has already been compiled without these
        // dependencies
        // NOTE: I'm assuming the first fileConfig has the `templates` module as
        // a dependency
        scope.$on('ocLazyLoad.moduleLoaded', function(e, module) {
          if (module === window.filesConfig[0].name) {
            $compile(element, null, 0)(scope);
          }
        });
      }
    };
  });
