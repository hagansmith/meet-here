

app.controller("MeetHereCtrl", function($routeParams, $scope, MapService){
  $scope.data = {};

 const getSingleMeet = () => {
   MapService.getAllMapDataForCurrentMeet($routeParams.id).then((results)=>{
     $scope.data=results;
     gMaps(results);
   }).catch((error)=>{
      console.log("error in getSingleMeet", error);
    });
};
getSingleMeet();

const gMaps = (results) => {
  GoogleMapsLoader.load(function(google) {
    console.log(results);
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat: -34.397, lng: 150.644},
      });

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(
          document.getElementById('info'));

      marker1 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: {lat: results[1].marker3.lat, lng: results[1].marker3.lng}
      });

      marker2 = new google.maps.Marker({
        map: map,
        draggable: true,
        position: {lat: results[1].marker4.lat, lng: results[1].marker4.lng}
      });
      midPoint = google.maps.geometry.spherical.interpolate(marker1.getPosition(), marker2.getPosition(),.5)
      console.log(midPoint);
      marker3 = new google.maps.Marker({
        map: map,
        draggable: true,
        position:{lat: midPoint.lat(), lng: midPoint.lng()}
      });

      var bounds = new google.maps.LatLngBounds(
          marker1.getPosition(), marker2.getPosition());
      map.fitBounds(bounds);

      google.maps.event.addListener(marker1, 'position_changed', update);
      google.maps.event.addListener(marker2, 'position_changed', update);

      poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
      });

      geodesicPoly = new google.maps.Polyline({
        strokeColor: '#CC0099',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        geodesic: true,
        map: map
      });

      update();


    function update() {
      var path = [marker1.getPosition(), marker2.getPosition()];
      poly.setPath(path);
      geodesicPoly.setPath(path);
      var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
      midPoint = google.maps.geometry.spherical.interpolate(marker1.getPosition(), marker2.getPosition(),.5);

      console.log("midPoint:\r\nlat: " + midPoint.lat() + ", lng: " + midPoint.lng());
      //marker3.push( position : {midPoint.lat(), midPoint.lng()} );
      document.getElementById('heading').value = heading;
      document.getElementById('origin').value = path[0].toString();
      document.getElementById('destination').value = path[1].toString();
    }
  });
};
});
