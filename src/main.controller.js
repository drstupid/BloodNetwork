var APP = APP || {};

APP.stash = {
    entries: null /* the entries of the center locations */
};

APP.gmap = {
    mapContainer: null,
    map: null,
    center: {lat: 45.9261619, lng: 22.7662909},
    zoom: 6,

    pins: [],
    loadedPins: false,

    addPin2Gmap: function(poi) {
        if ( (poi) && (typeof poi === "object") ) {
            var point = {lat: parseFloat(poi.lat), lng: parseFloat(poi.long)}
            APP.gmap.pins.push(point);
        }
    },

    showPinsOnGmap: function() {
        $.each(APP.gmap.pins, function(index, location) {
            var marker = new google.maps.Marker({
                position: location,
                map: APP.gmap.map
            });
        });
    },

    showPinOnGmap: function(centerPoint) {
        APP.gmap.map.setCenter(centerPoint);
        APP.gmap.map.setZoom(18);
    }

};

function initGMap() {

    APP.gmap.initializeMap = function() {
        if (!APP.gmap.mapContainer){
            setTimeout(APP.gmap.initializeMap, 100);
            return;
        }
        APP.gmap.map = new google.maps.Map(APP.gmap.mapContainer, {
            zoom: APP.gmap.zoom,
            center: APP.gmap.center
        });

        if (APP.gmap.loadedPins) {
            APP.gmap.showPinsOnGmap();
        }
    };


    APP.gmap.mapContainer = document.getElementById('map');
    APP.gmap.initializeMap();
}

$(document).ready(function() {

    $('.carousel').carousel({
      interval: 2000
    })

    $.getJSON("/centers", function(data) {
        initializeLocations(data);
    })

    //populate city lists
    function initializeLocations(data) {
        APP.stash.entries = data;

        $.each(data, function(index, entry) {
            var $li = $("<li><a href='javascript:void(0)' data-coords='" + JSON.stringify(entry.coords) + "'>" + entry.name + "<br/><small>" + entry.address + "</small></a></li>");
            $("#location-centers").append($li);

            APP.gmap.addPin2Gmap(entry.coords);

            $li.find("a").first().click(function(event){
                event.preventDefault();
                var centerLocation = $(this).data("coords");
                var pos = {lat: parseFloat(centerLocation.lat), lng: parseFloat(centerLocation.long)};

                if ( (pos.lat) && (pos.lng) ) {
                    APP.gmap.showPinOnGmap(pos);
                } else {
                    console.log("Center does not have a locaiton set!");
                }
            });
        });

        if (APP.gmap.map) {
            APP.gmap.showPinsOnGmap();
        } else {
            APP.gmap.loadedPins = true;
        }
    }


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
