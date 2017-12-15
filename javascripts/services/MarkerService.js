

app.service("MarkerService", function ($http, $q, FIREBASE_CONFIG){

const saveMarkerInfo = (meet, meetMarkers, meetId) => {
  let markerObject1 = {
    "meetid" : meetId,
    "address" : meet.marker1,
    "lat": meetMarkers.marker1.pos.lat,
    "lng": meetMarkers.marker1.pos.lng
  };

  let markerObject2 = {
    "meetid" : meetId,
    "address" : meet.marker2,
    "lat": meetMarkers.marker2.lat,
    "lng": meetMarkers.marker2.lng
  };
return $http.post(`${FIREBASE_CONFIG.databaseURL}/markers.json`, JSON.stringify(markerObject1)).then((result) =>{
  return $http.post(`${FIREBASE_CONFIG.databaseURL}/markers.json`, JSON.stringify(markerObject2));
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

const editMarkerInfo1 = (meet, originalMeet, meetMarkers) => {
  let marker1 = originalMeet.marker1.id;
  if (!meetMarkers.marker1) {
    return;
  } else {
    let markerObject1 = {
      "address" : meet.marker1,
      "lat": meetMarkers.marker1.lat,
      "lng": meetMarkers.marker1.lng,
      "meetid": originalMeet.marker1.meetid
  };
    return $http.put(`${FIREBASE_CONFIG.databaseURL}/markers/${marker1}.json`, JSON.stringify(markerObject1));
}
};

const editMarkerInfo2 = (meet, originalMeet, meetMarkers) => {
  let marker2 = originalMeet.marker2.id;
  if (!meetMarkers.marker2) {
    return;
  } else {
    let markerObject2 = {
      "address" : meet.marker2,
      "lat": meetMarkers.marker2.lat,
      "lng": meetMarkers.marker2.lng,
      "meetid": originalMeet.marker2.meetid
  };
    return $http.put(`${FIREBASE_CONFIG.databaseURL}/markers/${marker2}.json`, JSON.stringify(markerObject2));
}
};

const deleteMarker = (markerId) => {
  return $http.delete(`${FIREBASE_CONFIG.databaseURL}/markers/${markerId}.json`);
};

return {saveMarkerInfo, getMarkersByMeetId, deleteMarker, editMarkerInfo1, editMarkerInfo2};

});
