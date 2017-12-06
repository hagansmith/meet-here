

app.service("MapService", function ($http, $q, FIREBASE_CONFIG, MAP_CONFIG){

  const saveQuery = (meet) => {
    //convert standard data to coordinates then post
    return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meet));
  };

  const getCurrentMeet = (meetId) => {
    //meetData = [];
    return $q((resolve, reject) => {
      $http.get(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`).then((meet) =>{
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
  let meetData = {};
    // return Promise.all([getCurrentMeet(meetId), getMarkersByMeetId(meetId), getMeetLocationsByMeetId(meetId)]).then((results) => {
    //   results.forEach((result) =>{
    //     console.log(result);
    //
    //   });
    // });
    return $q((resolve, reject) => {
      return getCurrentMeet(meetId)
    .then((meet) => {
      Object.keys(meet).forEach((key)=>{
        meetData[key] = meet[key];
      });
      return getMarkersByMeetId(meetId);
    }).then((markers)=>{
      let markersArray = [];
      Object.keys(markers).forEach((key)=>{
        markers[key].id = key;
        markersArray.push(markers[key]);
      });
      meetData.marker1 = markersArray[0];
      meetData.marker2 = markersArray[1];
      return getMeetLocationsByMeetId(meetId);
    }).then((locations)=>{
      Object.keys(locations).forEach((key)=>{
        meetData[key] = locations[key];
      });
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
