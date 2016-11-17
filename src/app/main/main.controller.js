(function() {
  'use strict';

  angular
    .module('bloodNetwork')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, toastr, FindData) {

    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1479204326682;

    activate();

    $('.carousel').carousel({
      interval: 2000
    })

    function activate() {
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }
  }
})();
