

app.controller("MeetLaterCtrl", function($location, $rootScope, $scope, MapService){


// use current location to fill in address
  $scope.useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        MapService.reverseGeocode(pos).then((result)=> {
          $scope.currentLocation = result.data.results[0].formatted_address;
        });
      });
    }
  };


  $scope.meetLaterDetails = (meet) => {
// check for a user uid if no id then assign id of randomUid
    if (!$rootScope.uid) {
      meet.uid = "noUid";
    } else {
      meet.uid = $rootScope.uid;
    }
      meet.history = true;
    MapService.saveMeetInfo(meet).then((result)=> {
      let meetId = result.data.name;
      MapService.saveMarkerInfo(meet, meetId);
      $location.path(`/MeetHere/${meetId}`);
    }).catch((error) => {
      console.log("error in controller, meetNowDetails", error);
    });
  };


    InitAutocomplete = () => {
      GoogleMapsLoader.load(function(google) {
       // Create the autocomplete object, restricting the search to geographical
       // location types.
      let autocomplete = new google.maps.places.Autocomplete(
           /** @type {!HTMLInputElement} */(document.getElementById("autocomplete2")),
           {types: ['geocode']});
       // When the user selects an address from the dropdown, populate the address
       // fields in the form.
     fillInAddress = () => {
         // Get the place details from the autocomplete object.
         var place = autocomplete.getPlace();
         console.log(place.geometry.location.lat());
         var val = place.formatted_address;
           document.getElementById('autocomplete2').value = val;
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
