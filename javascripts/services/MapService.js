

app.service("MapService", function ($http, $q, FIREBASE_CONFIG, MAP_CONFIG){

  const saveQuery = (meet) => {
    //convert standard data to coordinates then post
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meet));
  };

  const getCurrentMeet = (meetId) => {
    //meetData = [];
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`).then((meet) =>{
        //meetData.push(meet.data);
  //   return getMarkersByMeetId(meetId);
  // }).then((markers)=>{
  //   meetData.push(markers);
  //   return getMeetLocationsByMeetId(meetId);
  // }).then((locations)=>{
  //   meetData.push(locations);
    resolve(meet.data);
  }).catch((error)=>{
      console.log("error in service getCurrentMeet", error);
    });
  });
};

  const getMarkersByMeetId = (meetId) => {
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/markers.json?orderBy="meetid"&equalTo="${meetId}"`).then((markers) =>{
        resolve(markers.data);
    }).catch((error)=>{
        console.log("error in service getMarkersByMeetId", error);
    });
  });
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

const getAllMapDataForCurrentMeet = (meetId) => {
let meetData = [];
  return $q((resolve, reject) => {
  return getCurrentMeet(meetId)
.then((meet) => {
  meetData.push(meet);
  return getMarkersByMeetId(meetId);
}).then((markers)=>{
  meetData.push(markers);
  return getMeetLocationsByMeetId(meetId);
}).then((locations)=>{
  meetData.push(locations);
  resolve(meetData)
}).catch((error) => {
  console.log("error in service getAllMapDataForCurrentMeet", error);
});
});
};

  const getMapByAddressQuery = (address) => {
        return $http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${MAP_CONFIG}`);
    };

  return { getMapByAddressQuery, getAllMapDataForCurrentMeet, saveQuery };

});
