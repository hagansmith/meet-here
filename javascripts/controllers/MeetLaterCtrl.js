app.controller("MeetLaterCtrl", function($location, $routeParams, $rootScope, $scope, MeetService, MarkerService, MapService){

  let meetMarkers = {};
  let originalMeet;
  let newMeet = {};

  // use current location to fill in address
  $scope.useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        meetMarkers.marker1 = { pos };
        newMeet = {"marker1":{lat : pos.lat, lng : pos.lng}};
        MapService.reverseGeocode(pos).then((result)=> {
           $scope.meet.marker1 = result.data.results[0].formatted_address;
           newMeet.marker1.address = result.data.results[0].formatted_address;
        });
      });
    }
  };

  // Save meet details
  $scope.meetLaterDetails = (meet) => {
    // check for a user uid if no id then assign id of randomUid
    if (!$rootScope.uid) {
      meet.uid = "noUid";
    } else {
      meet.uid = $rootScope.uid;
    }
      meet.history = true;
      MeetService.saveMeetInfo(meet).then((result)=> {
          let meetId = result.data.name;
          MarkerService.saveMarkerInfo(meet, meetMarkers, meetId).then(()=>{
          $location.path(`/MeetHere/${meetId}`);
        }).catch((error) => {
          console.log("error in conroller, meetNowDetails Save Marker Info");
          });
    }).catch((error) => {
      console.log("error in controller, meetNowDetails", error);
    });
  };

  // Autocomplete address
  const InitAutocomplete = () => {
    GoogleMapsLoader.load(function(google) {
    // Create the autocomplete object, restricting the search to geographical
       // location types.
      let autocomplete = new google.maps.places.Autocomplete(
           /** @type {!HTMLInputElement} */(document.getElementById("autocomplete")),
           {types: ['geocode']});

       // When the user selects an address from the dropdown, populate the address
       // fields in the form.
    const  fillInAddress = () => {
         // Get the place details from the autocomplete object.
         var place = autocomplete.getPlace();
         let place1 = place.geometry.location.lat();
         let place2 =place.geometry.location.lng();
         meetMarkers.marker2 = {lat: place1, lng:place2};
         var val = place.formatted_address;
           $scope.meet.marker2 = val;
     };

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
 };

 const getSingleMeet = () => {
   MeetService.getAllMapDataForCurrentMeet($routeParams.id).then((results)=>{
     originalMeet = results;
     // Create a formatted object for use by ng-model. This format is required to make the data match the original form
     let  formattedresults = {
       "marker1": results.marker1.address,
       "marker2": results.marker2.address,
       "routeBy": "distance",
       "where": results.where,
       "name": results.name,
       "min": results.when,
       "edit":true,
       "place": results.place
     };
   $scope.meet=formattedresults;
   meetMarkers = {
     marker1: {
       "address": results.marker1.address,
       "lat": results.marker1.lat,
       "lng": results.marker1.lng,
       "id": results.marker1.id
     },
     marker2: {
       "address":results.marker2.address,
       "lat":results.marker1.lat,
       "lng":results.marker1.lng,
       "id":results.marker2.id
     },
   };
    InitAutocomplete();
   }).catch((error)=>{
      console.log("error in getSingleMeet", error);
    });
  };

  const editMeet = () => {
    if (!$routeParams.id) {
      InitAutocomplete();
    } else {
       getSingleMeet();
    }
  };

  editMeet();

  // Update meet details
  $scope.updateMeetLaterDetails = (meet) => {
    $scope.meet = meet;
    MeetService.editMeetInfo(meet, originalMeet).then(() => {
      if (meet.marker1) {
        MarkerService.editMarkerInfo1(meet, originalMeet, newMeet);
      }
      if (meet.marker2) {
          MarkerService.editMarkerInfo2(meet, originalMeet, newMeet);
      }
      meetId = $routeParams.id;
      $location.path(`/MeetHere/${meetId}`);
    });
  };

  $scope.places = [
    "airport", "amusement_park", "aquarium", "art_gallery", "atm", "bakery", "bank", "bar", "beauty_salon", "book_store", "bowling_alley", "bus_station", "cafe", "campground", "casino","cemetery", "church", "city_hall", "clothing_store", "convenience_store", "courthouse", "department_store", "embassy", "gas_station", "library", "lodging", "movie_theater", "museum", "night_club", "park", "parking", "restaurant",  "rv_park", "shopping_mall", "store", "subway_station", "university", "zoo"
  ];

});
