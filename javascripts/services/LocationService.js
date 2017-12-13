

app.service("LocationService", function ($http, $q, FIREBASE_CONFIG){

const saveLocationInfo = (midpoint, meetId, meetAddress) => {
  let locationObject = {
    "meetid" : meetId,
    "lat" : midpoint.lat(),
    "lng" : midpoint.lng(),
    "address" : meetAddress
  };
  return $http.post(`${FIREBASE_CONFIG.databaseURL}/meetLocations.json`, JSON.stringify(locationObject));
};

const getMeetLocationsByMeetId = (meetId) => {
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/meetLocations.json?orderBy="meetid"&equalTo="${meetId}"`).then((meetLocations) => {
        resolve(meetLocations.data);
    }).catch((error)=>{
      console.log("error in service getMeetLocationsByMeetId", error);
    });
  });
};

return {saveLocationInfo, getMeetLocationsByMeetId};

});
