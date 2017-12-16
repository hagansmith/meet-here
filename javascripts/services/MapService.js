app.service("MapService", function ($http, $q, MAP_CONFIG, LocationService, MarkerService, MeetService){

  const getCoordByAddressQuery = (address) => {
    return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
  };

  const reverseGeocode = (coord) => {
    return $http.get (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${MAP_CONFIG}`);
  };

  const placeDetail = (placeID) => {
    return $http.get (`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${MAP_CONFIG}`);
  };

  const directions = (meet, middy) => {
    return $http.get (`https://maps.googleapis.com/maps/api/directions/json?origin=${meet.marker1.address}&destination=${middy.lat},${middy.lng}&key=${MAP_CONFIG}`);
  };

  return { directions, getCoordByAddressQuery, reverseGeocode, placeDetail};

});
