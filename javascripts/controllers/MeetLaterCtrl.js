

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
 });
