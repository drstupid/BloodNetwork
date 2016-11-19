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
/** GET CENTERS LOCATION */
//https://bloodnetwork.apispark.net/v1/locationses/?media=json
/*
    $.get("http://bloodnetwork.herokuapp.com/centers/", function(result){
      alert(result);
        //   $.each(result, function(i, field){
               //$("#location-centers").prepend('<li><a href="#">' + field.city + '</a></li>');
          //     alert(field.tel)
          // });
       });
*/
/*
$.getJSON("/centers", function(result){
        $.each(result, function(i, field){
            alert(field.city)
        });
    });
*/
$.getJSON("/centers", function(result) {
      $.each(result, function(i, object){
          if (i< 2) {
          alert(object.name);
      }
  })
})

/** MODAL 1 **********************************************************/
/*********************************************************************/
/** MODAL 1 SHOW */
    $('#myModal').on('shown.bs.modal', function () {
      $('#eligibleCheck').prop('checked', false);
      $('#mySend').prop('disabled', true);
    })
/** MODAL 1 CONFIRM eligibleCheck*/
    $('#eligibleCheck').on('click', function (e) {
      if ($("#eligibleCheck").is(':checked')){
          $('#mySend').prop('disabled', false);
          }
          else{
            $('#mySend').prop('disabled', true);
          }
    })
    /** MODAL 1 SUBMIT FORM */
        $('#mySend').on('click', function (e) {
          $('#myModal').modal('hide');
          $('#myModal2').modal('show');
            $.ajax({
                           type: "POST",
                           url: "http://localhost:8080/registrationAction22",
                           data: "number=+407492755545",
                           success: function (data)
                           {
                           },
                           error: function (error) {
                               $('#myModal2').modal('show');
                      }
                       });
        })

    /** MODAL 2 **********************************************************/
    /*********************************************************************/
    /** MODAL 2 SHOW */
        $('#myModal2').on('shown.bs.modal', function () {
      $('#sentNumber').html(  $('#phone').val());
      $('#mySendSMS').prop('disabled', true);
        })

    /** MODAL 2 CHECK smsCode LENGHT*/
        $('#smsCode').on('keyup', function (e) {
          if($('#smsCode').val().length>=4){
                  $('#mySendSMS').prop('disabled', false);
          }
        })
    /** MODAL 2 SUBMIT FORM*/
        $('#mySendSMS').on('click', function (e) {
          $('#myModal').modal('hide');
          $('#myModal2').modal('show');
            $.ajax({
                           type: "POST",
                           url: "http://localhost:8080/registrationAction22",
                           data: "number=+407492755545",
                           success: function (data)
                           {
                           },
                           error: function (error) {
                               $('#myModal2').modal('show');
                      }
                       });
        })
    /** MODAL 3 **********************************************************/
    /*********************************************************************/
    /** MODAL 3 SHOW */

    //missing
      }
    })();
