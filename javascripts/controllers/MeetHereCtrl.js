

app.controller("MeetHereCtrl", function($location, $q, $rootScope, $routeParams, $scope, AuthService, LocationService, MapService, MeetService){
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
           return $q((resolve, reject) => {
             MapService.directions($scope.meet, middy).then((directions)=> {
               // console.log("directions", directions);
               $scope.duration = directions.data.routes["0"].legs["0"].duration.text;
               return MapService.reverseGeocode(middy).then((address) => {
                 $scope.meetAddress = address.data.results[0].formatted_address;
               });
             });
           }).catch((error)=> {
              console.log("error in directions", error);
           });
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
       var map;
       var service;
       var infowindow;



      map = new google.maps.Map(document.getElementById('map'), {
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
      var location= new google.maps.LatLng(midPoint.lat() ,midPoint.lng());
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

      var cityCircle = new google.maps.Circle(
        {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            // fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: {lat: midPoint.lat(), lng: midPoint.lng()},
            radius: 500
          }
        );


      //update();


          map = new google.maps.Map(document.getElementById('map'), {
              center: location,
              zoom: 14
            });

          var request = {
            location: location,
            radius: '1000',
            type: ['cafe']
          };


          service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, callback);

          let meetMarker = new google.maps.Marker (
            {
              map: map,
              position: {lat: midPoint.lat(), lng: midPoint.lng()},
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/red.png",
                anchor: new google.maps.Point(10, 10),
              }
            }
          );

          function callback (results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                var place = results[i];
                addMarker(place);
              }
            }
          }

          function addMarker(place) {
              var markers = new google.maps.Marker(
                {
                  map: map,
                  position: place.geometry.location,
                  icon: {
                    url: place.icon,
                    anchor: new google.maps.Point(10, 10),
                    scaledSize: new google.maps.Size(10, 10)
                  }
                }
              );
            }



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
      $rootScope.userUid = result.user.uid;
      userUid = result.user.uid;
    });
  } else {
    meet.saved = true;
    let meetId = $routeParams.id;
    MeetService.updateMeet(meet, meetId, userUid);
    LocationService.saveLocationInfo(midPoint, meetId, $scope.meetAddress);
}
};


$scope.directionsDisplay = (meet, value) => {
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

  directionsDisplay = new google.maps.DirectionsRenderer();
  var location = new google.maps.LatLng(meet.location.lat, meet.location.lng);
  var mapOptions = {
    zoom:7,
    center: location
  };
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);


function calcRoute(meet, value) {
  let start;
  if (value === 1) {
  start = meet.marker1.address;
  } else if (value === 2){
  start = meet.marker2.address;
  }
  var end = meet.location.address;
  var request = {
    origin: start,
    destination: end,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, function(result, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(result);
    }
  });
}
  calcRoute(meet, value);
};

$scope.meetNowDetails = (meet) => {
  let meetId =  meet.marker1.meetid;
   if (!meet.where){
     $location.path(`/MeetNow/${meetId}`);
   }else{
     $location.path(`/MeetLater/${meetId}`);
   }
};

});
