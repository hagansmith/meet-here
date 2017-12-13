
app.service("MapService", function ($http, $q, MAP_CONFIG, LocationService, MarkerService, MeetService){


  const getCoordByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
  };

  const reverseGeocode = (coord) => {
    return $http.get (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${MAP_CONFIG}`);
  };

const placeSearch = (coord) => {
  var map;
  var service;
  var infowindow;

    var location= new google.maps.LatLng(coord.lat ,coord.lng);

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
        position: {lat:coord.lat, lng:coord.lng},
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
};

const placeDetail = (placeID) => {
  return $http.get (`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${MAP_CONFIG}`);
};

const directions = (meet, middy) => {
return $http.get (`https://maps.googleapis.com/maps/api/directions/json?origin=${meet.marker1.address}&destination=${middy.lat},${middy.lng}&key=${MAP_CONFIG}`);
};

  return { directions, getCoordByAddressQuery, reverseGeocode, placeSearch, placeDetail};

});
