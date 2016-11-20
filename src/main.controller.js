var APP = APP || {};

APP.stash = {
    entries: null /* the entries of the center locations */
};

APP.gmap = {
    mapContainer: null,
    map: null,
    center: {lat: 46.048836, lng: 24.884033},
    bounds: null,
    zoom: 6,
    minZoom: 6,
    infoWindows: [],
    pins: [],
    loadedPins: false,

    addPin2Gmap: function(poi) {
        if ( (poi) && (typeof poi === "object") ) {
            var point = {lat: parseFloat(poi.lat), lng: parseFloat(poi.lng)}
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
        APP.gmap.map.setZoom(16);
    }

};

function initGMap() {
    APP.gmap.bounds = new google.maps.LatLngBounds();
    APP.gmap.initializeMap = function() {
        if (!APP.gmap.mapContainer){
            setTimeout(APP.gmap.initializeMap, 100);
            return;
        }
        APP.gmap.map = new google.maps.Map(APP.gmap.mapContainer, {
            zoom: APP.gmap.zoom,
            minZoom: APP.gmap.minZoom,
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
        APP.stash.centers = {};
        APP.stash.cities = [];

        // remap
        $.each(data, function(index, entry) {
            APP.gmap.addPin2Gmap(entry.coords);

            var centerCity = entry.city;
            APP.stash.cities.push(centerCity);

            if (!APP.stash.centers[centerCity]) {
                APP.stash.centers[centerCity] = [];
            }

            APP.stash.centers[centerCity].push(entry);
        });

        // Autocomplete
        $("input.autocomplete").autoComplete({
            minChars: 0,
            source: function(term, suggest){
                term = term.toLowerCase();
                var choices = APP.stash.entries;
                var suggestions = [];
                for (i=0;i<choices.length;i++) {
                    if (~(choices[i].city + ' ' + choices[i].name + ' ' + choices[i].address).toLowerCase().indexOf(term)) {
                        suggestions.push(choices[i]);
                    }
                }
                suggest(suggestions);
            },
            renderItem: function (item, search){
                search = search.toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
                return '<div class="autocomplete-suggestion" data-city="'+item.city+'" data-name="'+item.name+'" data-address="'+item.address+'" data-tel="'+JSON.stringify(item.tel)+'">'+item.city.replace(re, "<b>$1</b>")+'</div>';
            },
            onSelect: function(e, term, item){
                var cityName = item.data('city');
                // Set field value
                $("input.autocomplete").val(item.data('city')+'');

                var centers = null;
                if (cityName) {
                    centers = APP.stash.centers[cityName];
                }

                if (centers) {
                    var count = 0;
                    APP.gmap.bounds = new google.maps.LatLngBounds();
                    $.each(centers, function(i,entry){
                        var loc = entry.coords;
                        if ( (loc) && (APP.gmap.bounds) ) {
                            APP.gmap.bounds.extend(loc);
                        }
                        count++;
                    });

                    // fit the google maps
                    APP.gmap.map.fitBounds(APP.gmap.bounds);
                    if (count == 1) {
                        APP.gmap.map.setZoom(16);

                        var centerPhones = centers[0].tel;

                        if (!centerPhones) {
                            centerPhones = [];
                        } else if (typeof centerPhones !== "Array") {
                            centerPhones = [centerPhones];
                        }

                        var $infoContainer = $("div#centerInfo");
                        $infoContainer.find("p.js-center-name").first().html(centers[0].name);
                        $infoContainer.find("p.js-center-address").first().html(centers[0].address);
                        $infoContainer.find("p.js-center-phone").first().html(centerPhones.join(", "));
                    }
                }

            }
        });

        $("#btnClear").click(function(event){
            event.preventDefault();
            $("input.autocomplete").val("");

            var $infoContainer = $("div#centerInfo");
            $infoContainer.find("p.js-center-name").first().html("- Toate centrele de transfuzii sanguine din Romania");
            $infoContainer.find("p.js-center-address").first().html("-");
            $infoContainer.find("p.js-center-phone").first().html("-");

            APP.gmap.map.setCenter(APP.gmap.center);
            APP.gmap.map.setZoom(APP.gmap.zoom);
        });


        if (APP.gmap.map) {
            APP.gmap.showPinsOnGmap();
        } else {
            APP.gmap.loadedPins = true;
        }

    };


    /** PHONE NUMBER VALIDATOR */
    $(document.body).on("keypress", "input#phoneNumber", function(e) {
        var verified = (e.which == 8 || e.which == undefined || e.which == 0) ? null : String.fromCharCode(e.which).match(/[^0-9]/);

        if ( (verified) || ($(this).val().length > 10) ) {e.preventDefault();}
    });

/** SCROLL*/
$('a[href^="#"]').on('click',function (e) {
       e.preventDefault();

       var target = this.hash;
       $target = $(target);

       $('html, body').stop().animate({
           'scrollTop':  $target.offset().top
       }, 900, 'swing', function () {
           window.location.hash = target;
       });
   });

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
                               data: "phoneNumber=%2B4"+$('#phoneNumber').val()+"&validationCode="+$('#smsCode').val(),
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
                $('#myReSend').on('click', function (e) {
                  if(validatePhoneNumber($("#phoneNumber").val())){
                    $.ajax({
                                     type: "POST",
                                     url: "/registrationReAction",
                                     data: "phoneNumber=%2B4"+$('#phoneNumber').val(),
                                     success: function (data)
                                     {
                                       $('#myModal2').modal('hide');
                                         $('#myModal2').modal('show');
                                     },
                                     error: function (error) {
                                       $('#myModal2').modal('hide');
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
