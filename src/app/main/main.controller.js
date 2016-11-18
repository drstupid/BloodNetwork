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

    $.getJSON("https://bloodnetwork.apispark.net/v1/locationses/?media=json", function(result){
           $.each(result, function(i, field){
               $("#location-centers").prepend('<li><a href="#">' + field.city + '</a></li>');
           });
       });

    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').focus()
    })

$('#myModalSend').on('click', function (e) {
    $('#myModal').modal('hide');
    $('#myModal2').modal('show');
    $.ajax({
                   type: "POST",
                   url: "http://localhost:8080/registrationAction",
                   data: "number=+407492755545",
                   success: function (data)
                   {
                      $('#myModal2').modal('show');
                   }
               });


})

$('#myModalCheck').on('click', function (e) {
  if ($("#myModalCheck").is(':checked')){
      $('#myModalSend').prop('disabled', false);
      }
      else{
        $('#myModalSend').prop('disabled', true);
      }
})
    function activate() {
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }
  }
})();
