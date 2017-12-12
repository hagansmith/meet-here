

app.controller("MeetHereCtrl", function($q, $rootScope, $routeParams, $scope, AuthService, LocationService, MapService, MeetService){
  $scope.meet = {};
  $scope.meetAddress = {};
  let userUid = $rootScope.uid;
  let midPoint = {};

 const getSingleMeet = () => {
   return $q((resolve, reject) => {
     MeetService.getAllMapDataForCurrentMeet($routeParams.id).then((results)=>{
       $scope.meet=results;
       return $q((resolve, reject) => {
         gMaps(results).then(()=> {
           let middy =  {lat:midPoint.lat(), lng:midPoint.lng()};
           return MapService.reverseGeocode(middy).then((address) => {
             console.log($scope.meet);
             $scope.meetAddress = address.data.results[0].formatted_address;
           });

          //MapService.placeSearch(results)
        });
       }).catch((error) => {
         console.log("error in get single meet gMaps", error);
       });

    });
   }).catch((error)=>{
      console.log("error in getSingleMeet", error);
  });
};
getSingleMeet();

// use meet coordinates to calculate midpoint coordinates
const gMaps = (results) => {
   return $q((resolve, reject) => {
     GoogleMapsLoader.load(function(google) {
      var map = new google.maps.Map(document.getElementById('map'), {
        // zoom: 12,
        // center: {lat: 41.850033, lng: -87.6500523},
      });

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          document.getElementById('info'));

      let marker1 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: {lat: results.marker1.lat, lng: results.marker1.lng}
      });

      let marker2 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: {lat: results.marker2.lat, lng: results.marker2.lng}
      });

      midPoint = google.maps.geometry.spherical.interpolate(marker1.getPosition(), marker2.getPosition(), ".5" );
      let marker3 = new google.maps.Marker({
        map: map,
        draggable: true,
        position:{lat: midPoint.lat(), lng: midPoint.lng()}
      });

      var bounds = new google.maps.LatLngBounds(
          marker1.getPosition(), marker2.getPosition());
      map.fitBounds(bounds);

      google.maps.event.addListener(marker1, 'position_changed', update);
      google.maps.event.addListener(marker2, 'position_changed', update);

      let poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
      });

      // geodesicPoly = new google.maps.Polyline({
      //   strokeColor: '#CC0099',
      //   strokeOpacity: 1.0,
      //   strokeWeight: 3,
      //   geodesic: true,
      //   map: map
      // });

      //update();
      console.log(midPoint);
      resolve (midPoint);

    function update() {
      var path = [marker1.getPosition(), marker2.getPosition()];
      poly.setPath(path);
      // geodesicPoly.setPath(path);
      var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
      document.getElementById('heading').value = heading;
      document.getElementById('origin').value = path[0].toString();
      document.getElementById('destination').value = path[1].toString();
    }
  });
});
};


$scope.saveDetail = (meet) => {
  if (!userUid){
    AuthService.authenticateGoogle().then((result)=>{
      userUid = result.user.uid;
    });
  } else {
    meet.saved = true;
    let meetId = $routeParams.id;
    MeetService.updateMeet(meet, meetId, userUid);
    LocationService.saveLocationInfo(midPoint, meetId);
}
};

});
