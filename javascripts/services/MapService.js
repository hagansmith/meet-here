

app.service("MapService", function ($http, $q, MAP_CONFIG){

  const getMapByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
    };

    return { getMapByAddressQuery };

});
