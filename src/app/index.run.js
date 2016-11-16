(function() {
  'use strict';
  angular
    .module('bloodNetwork')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
