

app.controller("MeetNowCtrl", function($location, $rootScope, $scope, MapService){

  let meetMarkers = {};

  // use current location to fill in address
    $scope.useCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          meetMarkers.marker1 = { pos };
          MapService.reverseGeocode(pos).then((result)=> {
            $scope.meet.marker1 = result.data.results[0].formatted_address;
          });
        });
      }
    };

  // Save meet details
  $scope.meetNowDetails = (meet) => {
    if (!$rootScope.uid) {
      meet.uid = "noUid";
    } else {
      meet.uid = $rootScope.uid;
    }
    meet.history = true;
    MapService.saveMeetInfo(meet).then((result)=> {
      let meetId = result.data.name;
      MapService.saveMarkerInfo(meet, meetMarkers, meetId);
      $location.path(`/MeetHere/${meetId}`);
    }).catch((error) => {
      console.log("error in controller, meetNowDetails", error);
    });
  };

  // Autocomplete address
      InitAutocomplete = () => {
        GoogleMapsLoader.load(function(google) {
         // Create the autocomplete object, restricting the search to geographical
         // location types.
        let autocomplete = new google.maps.places.Autocomplete(
             /** @type {!HTMLInputElement} */(document.getElementById("autocomplete")),
             {types: ['geocode']});

         // When the user selects an address from the dropdown, populate the address
         // fields in the form.
       fillInAddress = () => {
           // Get the place details from the autocomplete object.
           var place = autocomplete.getPlace();
           let place1 = place.geometry.location.lat()
           let place2 =place.geometry.location.lng()
           meetMarkers.marker2 = {lat: place1, lng:place2};
           var val = place.formatted_address;
             $scope.meet.marker2 = val;
       }

       autocomplete.addListener('place_changed', fillInAddress);

       // Bias the autocomplete object to the user's geographical location,
       // as supplied by the browser's 'navigator.geolocation' object.
      geolocate = () => {
         if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(function(position) {
             var geolocation = {
               lat: position.coords.latitude,
               lng: position.coords.longitude
             };
             var circle = new google.maps.Circle({
               center: geolocation,
               radius: position.coords.accuracy
             });
             autocomplete.setBounds(circle.getBounds());
           });
         }
       };
     });
    }

    InitAutocomplete();




});
