
$(document).ready(function() {


    $('.carousel').carousel({
      interval: 2000
    })

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
var addresesJSON = '';
$.getJSON("/centers", function(result) {
  addresesJSON = result;
})
//populate city lists
$.each(addresesJSON, function(key, data){
      $.each(data, function (index, data1) {
        $('#location-centers').append('<li><a href="#">asdasd</a></li>');
      })
})
alert(addresesJSON)

/** MODAL 1 **********************************************************/
/*********************************************************************/
/** MODAL 1 SHOW */
    $('#myModal').on('shown.bs.modal', function () {
      $('#eligibleCheck').prop('checked', false);
      $('#phoneNumber').prop('value', '');
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
    // data: "number=+4"+$('#phoneNumber').val(),
        $('#mySend').on('click', function (e) {
          $('#myModal').modal('hide');
          $('#myModal2').modal('show');
          if(validatePhoneNumber($("#phoneNumber").val())){
              $.ajax({
                             type: "POST",
                             url: "/registrationAction",
                             data: "phoneNumber=%2B4"+$('#phoneNumber').val(),
                             success: function (data)
                             {
                               $('#myModal').modal('hide');
                               $('#myModal2').modal('show');
                             },
                             error: function (error) {

                        }
                         });
              }
              else{
                  $("#phoneNumberArea").prop('class','form-group has-error has-feedback')
                  $("#phoneNumber").prop('placeholder','Introdu numarul de telefon sub forma 07xxxxxxxx')
                  $("#phoneNumber").prop('value','')
              }
        })

      //validate phone number
      function validatePhoneNumber(phoneNumber){
      error=true;
      if(($.isNumeric(phoneNumber)==true && phoneNumber.length!=10)||($.isNumeric(phoneNumber)==false))
        error = false;
      return error;
      }

    /** MODAL 2 **********************************************************/
    /*********************************************************************/
    /** MODAL 2 SHOW */
      $('#myModal2').on('shown.bs.modal', function () {
      $('#sentNumber').html(  $('#phoneNumber').val());
            $('#smsCode').prop('value', '');
      $('#mySendSMS').prop('disabled', true);
        })

    /** MODAL 2 CHECK smsCode LENGHT*/
        $('#smsCode').on('keyup', function (e) {
          if($('#smsCode').val().length==4){
                  $('#mySendSMS').prop('disabled', false);
          }
          else{
              $('#mySendSMS').prop('disabled', true);
          }
        })
    /** MODAL 2 SUBMIT FORM*/
        $('#mySendSMS').on('click', function (e) {
          $('#myModal2').modal('hide');
          $('#myModal3').modal('show');
            $.ajax({
                           type: "POST",
                           url: "/phoneValidationAction",
                           data: "phoneNumber=%2B40745684353&validationCode=2649",
                           success: function (data)
                           {
                             $('#myModal2').modal('hide');
                             $('#myModal3').modal('show');
                           },
                           error: function (error) {

                      }
                       });
        })

        /** MODAL 2 RESEND SMS*/
        // TO DO !!!!
            $('#mySend').on('click', function (e) {
              if(validatePhoneNumber($("#phoneNumber").val())){
                $.ajax({
                                 type: "POST",
                                 url: "/registrationReAction",
                                 data: "phoneNumber=%2B4"+$('#phoneNumber').val(),
                                 success: function (data)
                                 {
                                 },
                                 error: function (error) {
                                     $('#myModal2').modal('show');
                            }
                             });
                  }
                  else{

                  }
            })


    /** MODAL 3 **********************************************************/
    /*********************************************************************/
    /** MODAL 3 SHOW */

    //missing

});
