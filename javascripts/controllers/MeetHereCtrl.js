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
                 $scope.duration = directions.data.routes["0"].legs["0"].duration.text;
                 if (parseInt($scope.duration.split(" ")[0]) > parseInt($scope.meet.when.split(" ")[0])) {
                   alert("you will never make it");
                 }
                 return MapService.reverseGeocode(middy).then((address) => {
                   $scope.meetAddress = address.data.results[0].formatted_address;
                   $scope.meet.location.address = address.data.results[0].formatted_address;
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
        map = new google.maps.Map(document.getElementById('map'));

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
      if (results.where) {
        midPoint = google.maps.geometry.spherical.interpolate(marker1.getPosition(), marker2.getPosition(), results .where);
      } else {
        midPoint = google.maps.geometry.spherical.interpolate(marker1.getPosition(), marker2.getPosition(), ".5");
      }
      $scope.meet.location = {
        "lat": midPoint.lat(),
        "lng": midPoint.lng()
      };
      let marker3 = new google.maps.Marker({
        map: map,
        draggable: true,
        position:{lat: midPoint.lat(), lng: midPoint.lng()}
      });
      var location= new google.maps.LatLng(midPoint.lat() ,midPoint.lng());
      var bounds = new google.maps.LatLngBounds(
          marker1.getPosition(), marker2.getPosition());
      map.fitBounds(bounds);

      let poly = new google.maps.Polyline({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: map,
      });

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

        map = new google.maps.Map(document.getElementById('map'), {
          center: location,
          zoom: 14
        });

        var request = {
          location: location,
          radius: '1500',
          type: [$scope.meet.place]
        };

        infowindow = new google.maps.InfoWindow();
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
                  url: "http://maps.google.com/mapfiles/ms/icons/blue.png",
                  anchor: new google.maps.Point(10, 10),
                  scaledSize: new google.maps.Size(15, 15)
                }
              }
            );
            google.maps.event.addListener(markers, 'click', function() {
              infowindow.setContent(place.name);
              infowindow.open(map, this);
            });
          }
          console.log(midPoint.lat());
          resolve (midPoint);
      });
    });
  };

  $scope.saveDetail = (meet) => {
    let uid = AuthService.getCurrentUid();
    if (!uid){
      AuthService.authenticateGoogle().then((result)=>{
        $rootScope.uid = result.user.uid;
        userUid = result.user.uid;
        saveMeet(meet);
      });
    } else {
      saveMeet(meet);
    }
  };

  const saveMeet = (meet) => {
    meet.saved = true;
    let meetId = $routeParams.id;
    MeetService.updateMeet(meet, meetId, userUid);
    LocationService.saveLocationInfo(midPoint, meetId, $scope.meetAddress);
    $location.url("/Profile");
  };

  $scope.directionsDisp = (meet, value) => {
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
    var end =  meet.location.address;
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
