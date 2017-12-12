
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
  return $http.get (`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${MAP_CONFIG}`);
};

const directions = (place) => {
  console.log("place in directions", place);
//return $http.get (`https://maps.googleapis.com/maps/api/directions/json?origin=${marker1}&destination=${marker1}&departure_time=${departure_time}&traffic_model=best_guess&key=${MAP_CONFIG}`);
};

  return { directions, getCoordByAddressQuery, reverseGeocode, placeSearch, placeDetail};

});
