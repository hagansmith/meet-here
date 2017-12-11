
app.service("MapService", function ($http, $q, MAP_CONFIG, LocationService, MarkerService, MeetService){


  const getCoordByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
  };

  const reverseGeocode = (coord) => {
    return $http.get (`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coord.lat},${coord.lng}&key=${MAP_CONFIG}`);
  };

const placeSearch = (coord, type) => {
  return $http.get (`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coord.lat},${coord.lng}&radius=500&types=food&name=cruise&key=${MAP_CONFIG}`);
};

const placeDetail = (placeID) => {
  return $http.get (`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}=${MAP_CONFIG}`);
};

  return { getCoordByAddressQuery, reverseGeocode, placeSearch, placeDetail};

});
