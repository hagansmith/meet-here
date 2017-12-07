

app.controller("MeetLaterCtrl", function($location, $rootScope, $scope, MapService){

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


  $scope.meetNowDetails = (meet) => {
// check for a user uid if no id then assign id of randomUid
    if (!$rootScope.uid) {
      meet.uid = "randomUid";
    } else {
      meet.uid = $rootScope.uid;
    }
    meet.saved = true;
    MapService.saveQuery(meet).then((result)=> {
      let meetId = result.data.name;
      $location.path(`/MeetHere/${meetId}`);
    }).catch((error) => {
      console.log("error in controller, meetNowDetails", error);
    });

  };
 });
