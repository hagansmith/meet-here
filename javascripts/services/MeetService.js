

app.service("MeetService", function ($http, $q, FIREBASE_CONFIG, LocationService, MarkerService){

const saveMeetInfo = (meet) => {
  let meetObject = {
    "history": meet.history,
    "routeBy": meet.routeBy,
    "uid": meet.uid,
    "where": meet.where,
    "name": meet.name,
    "when": meet.min,
    "place": meet.place
  };
  return $http.post(`${FIREBASE_CONFIG.databaseURL}/meets.json`, JSON.stringify(meetObject));
};

const getMeetInfoByUid = (userUid) => {
  let meets = [];
  return $q((resolve, reject) => {
    $http.get(`${FIREBASE_CONFIG.databaseURL}/meets.json?orderBy="uid"&equalTo="${userUid}"`).then((results)=>{
      let fbMeets = results.data;
      Object.keys(fbMeets).forEach((key) => {
          getAllMapDataForCurrentMeet(key).then((mapData)=>{
          meets.push(mapData);
        });
      });
      resolve (meets);
    }).catch((err)=>{
      reject(err);
    });
  });
};

const getCurrentMeet = (meetId) => {
  return $q((resolve, reject) => {
    $http.get(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`).then((meet) =>{
  resolve(meet.data);
}).catch((error)=>{
    console.log("error in service getCurrentMeet", error);
  });
});
};

const editMeetInfo = (meet, originalMeet) => {
  if (!meet) {
    return;
  } else {
  let meetObject = {
    "where": meet.where,
    "name": meet.name,
    "when": meet.min,
    "saved": originalMeet.saved,
    "history": originalMeet.history,
    "uid": originalMeet.uid
  };
  let meetId = originalMeet.marker1.meetid;
  return $http.put(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`, JSON.stringify(meetObject));
}
};

const updateMeet = (meet, meetId, userUid) => {
  let meetObject = {
    "history": meet.history,
    "routeBy": meet.routeBy,
    "uid": userUid,
    "where": meet.where,
    "saved": meet.saved,
    "name":meet.name,
    "when":meet.when
  };
    return $http.put(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`, JSON.stringify(meetObject));
};

  const deleteMeet = (meetId) => {
    return $http.delete(`${FIREBASE_CONFIG.databaseURL}/meets/${meetId}.json`);
  };

  const getAllMapDataForCurrentMeet = (meetId) => {
    let meetData = {};
      return $q((resolve, reject) => {
        return getCurrentMeet(meetId).then((meet) => {
          Object.keys(meet).forEach((key)=>{
            meetData[key] = meet[key];
          });
        return MarkerService.getMarkersByMeetId(meetId);
        }).then((markers)=>{
          let markersArray = [];
          Object.keys(markers).forEach((key)=>{
            markers[key].id = key;
            markersArray.push(markers[key]);
          });
          meetData.marker1 = markersArray[0];
          meetData.marker2 = markersArray[1];
          return LocationService.getMeetLocationsByMeetId(meetId);
        }).then((locations)=>{
          let locationArray = [];
          Object.keys(locations).forEach((key)=>{
            locations[key].id = key;
            locationArray.push(locations[key]);
          });
          meetData.location = locationArray[0];
          resolve(meetData);
        });
      }).catch((error) => {
        console.log("error in service getAllMapDataForCurrentMeet", error);
      });
    };


return {saveMeetInfo, getAllMapDataForCurrentMeet, getMeetInfoByUid, getCurrentMeet, editMeetInfo, updateMeet, deleteMeet};

});
