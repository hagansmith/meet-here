app.service("MapService", function ($http, $q, MAP_CONFIG, LocationService, MarkerService, MeetService){

  const getCoordByAddressQuery = (address) => {
    return $http.get(`https://safe-mesa-30633.herokuapp.com/api/geocode/?address=${address}&key=${MAP_CONFIG}`);
  };

  const reverseGeocode = (coord) => {
    return $http.get (`https://safe-mesa-30633.herokuapp.com/api/geocode/?latlng=${coord.lat},${coord.lng}&key=${MAP_CONFIG}`);
  };

  const placeDetail = (placeID) => {
    return $http.get (`https://safe-mesa-30633.herokuapp.com/api/place/details/?placeid=${placeID}&key=${MAP_CONFIG}`);
  };

  const directions = (meet, middy) => {
    return $http.get (`https://safe-mesa-30633.herokuapp.com/api/directions/?origin=${meet.marker1.address}&destination=${middy.lat},${middy.lng}&key=${MAP_CONFIG}`);
  };

  return { directions, getCoordByAddressQuery, reverseGeocode, placeDetail};

});
